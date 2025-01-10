import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/api/v1/users/user.repository';
import { VendorDayRepository } from './vendorday.repository';
import { CommonResponseService } from '@app/common/services';
import { ApproveFoodChartDto, AvailbleVendor, CreateFoodChartsDto, FooCharIdstDto } from './dtos/food-charts-dtos';
import { I18nContext } from 'nestjs-i18n';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { BasicQueryDto, getPaginationDetails, ILocation, IUser, LOCATION, ROLES } from '@app/common';


@Injectable()
export class FoodchartService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly vendorDayRepository: VendorDayRepository,
        private readonly responseService: CommonResponseService,
    ) { }

    async createFoodChart(
        allIds: FooCharIdstDto,
        payload: CreateFoodChartsDto,
        type: string,
        i18n: I18nContext,
        isEditable: boolean = true,
    ) {
        const formatDate = (date) => moment(new Date(date)).format('YYYY-MM-DD');

        const minDate = formatDate(
            Math.min(...payload.vendors.map((v) => new Date(v.date).getTime())),
        );
        const maxDate = formatDate(
            Math.max(...payload.vendors.map((v) => new Date(v.date).getTime())),
        );

        const existingVendors = await this.vendorDayRepository.find({
            date: { $gte: minDate, $lte: maxDate },
            ...allIds,
            type,
        });

        const newGroupId = uuid();
        const recordsToInsert = [];
        const bulkOperations = [];
        const deleteRecordIds = [];
        const existingVendorMap = new Map(existingVendors.map((v) => [v.date, v]));

        const groupId =
            existingVendors.find((v) => v.isApproved === 'Pending')?.groupId ||
            newGroupId;

        payload.vendors.forEach((vendor) => {
            const existingRecord = existingVendorMap.get(vendor.date);

            if (!existingRecord) {
                recordsToInsert.push({
                    ...vendor,
                    // dayOfWeek: moment(vendor.date).format('dddd'),
                    // isRecurring: false,
                    details: payload.details,
                    groupId: groupId,
                    ...allIds,
                    type,
                });
                return;
            }

            if (vendor.isDelete) {
                if (!isEditable) {
                    throw new BadRequestException(i18n.translate('messages.notDelete'));
                }

                if (existingRecord.isApproved === 'Approved') {
                    throw new BadRequestException(
                        i18n.translate('messages.notDeleteApprovedRecords'),
                    );
                }
                if (existingRecord.isApproved === 'Pending') {
                    deleteRecordIds.push(existingRecord._id);
                }
                return;
            }

            if (
                !isEditable &&
                vendor.vendorId !== existingRecord.vendorId?.toString()
            ) {
                throw new BadRequestException(i18n.translate('messages.notUpdate'));
            }

            if (
                existingRecord.isApproved === 'Approved' &&
                vendor.vendorId !== existingRecord.vendorId?.toString()
            ) {
                throw new BadRequestException(i18n.translate('messages.notChange'));
            }

            if (isEditable && existingRecord.isApproved === 'Pending') {
                bulkOperations.push({
                    updateOne: {
                        filter: {
                            ...allIds,
                            date: vendor.date,
                            groupId: existingRecord.groupId,
                        },
                        update: {
                            $set: {
                                ...existingRecord,
                                ...vendor,
                                isRecurring: false,
                                groupId: existingRecord.groupId || groupId,
                                details: payload.details,
                                type,
                                ...allIds,
                            },
                        },
                        upsert: true,
                    },
                });
            }
        });

        if (recordsToInsert.length) {
            await this.vendorDayRepository.insertMany(recordsToInsert);
        }

        if (bulkOperations.length) {
            await this.vendorDayRepository.bulkWrite(bulkOperations);
        }

        if (deleteRecordIds.length) {
            await this.vendorDayRepository.deleteMany({
                _id: { $in: deleteRecordIds },
            });
        }

        return this.responseService.success(
            await i18n.translate('messages.foodChartCreated'),
        );
    }

    async getFoodChartData(
        filter: any,
        queryData: AvailbleVendor,
        i18n: I18nContext,
    ) {
        const result =
            await this.vendorDayRepository.getFoodChartDataWithVendorsDetails({
                filter,
                startDate: queryData.startDate,
                endDate: queryData.endDate,
            });

        return this.responseService.success(
            i18n.translate('messages.vendorFetch'),
            { results: result },
        );
    }

    async getNearByVendorList(querydata: BasicQueryDto, userLocation: ILocation, location: string, i18n: I18nContext) {
        const { page = 1, limit = 10, searchQuery } = querydata;

        const query: any = {
            role: ROLES.VENDOR,
            status: 'active',
            verificationStatus: 'approved',
            thresHoldApprove: 'approved',
        };

        if (searchQuery) {
            query.$or = [
                { first_name: { $regex: searchQuery, $options: 'i' } },
                { last_name: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } },
            ];
        }

        if (location) {
            switch (location) {
                case LOCATION.COUNTRY:
                    query['location.country'] = {
                        $regex: `^${userLocation.district.trim()}$`,
                        $options: 'i',
                    }

                    break;
                case LOCATION.STATE:
                    query['location.state'] = {
                        $regex: `^${userLocation.district.trim()}$`,
                        $options: 'i',
                    }
                    break;
                case LOCATION.DISTRICT:
                    query['location.district'] = {
                        $regex: `^${userLocation.district.trim()}$`,
                        $options: 'i',
                    }

                    break;
                case LOCATION.CITY:
                    query['location.city'] = {
                        $regex: `^${userLocation.district.trim()}$`,
                        $options: 'i',
                    }
                    break;
                default:
                    break;
            }
        }

        const skip = (page - 1) * limit;

        const [vendors, total, totalFiltered] = await Promise.all([
            this.userRepository.findWithPagination(query, { skip, limit }),
            this.userRepository.countDocuments({}),
            this.userRepository.countDocuments(query),
        ]);

        const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
            getPaginationDetails({
                data: vendors,
                count: totalFiltered,
                limit: limit,
                skip,
            });

        const meta = {
            totalFiltered,
            total,
            currentPage: page,
            perPage: limit,
            totalPage,
            startIndex,
            endIndex,
            currentPageFilteredCount,
            searchQuery: searchQuery,
        };
        return this.responseService.success(
            await i18n.translate('messages.queryRetrieved'),
            { vendors },
            meta,
        );
    }

    async getFoodChartRequests(
        queryData: BasicQueryDto,
        user: IUser,
        foodChartType: string,
        location: string,
        i18n: I18nContext,
    ) {
        const {
            page = 1,
            limit = 10,
            searchQuery,
            orderBy = { createdBy: -1 },
        } = queryData;

        const skip = (page - 1) * limit;

        let locationSearch = {};

        if (location) {
            switch (location) {
                case LOCATION.COUNTRY:
                    locationSearch = {
                        'schoolDetails.location.country': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.STATE:
                    locationSearch = {
                        'schoolDetails.location.state': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.DISTRICT:
                    locationSearch = {
                        'schoolDetails.location.district': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.CITY:
                    locationSearch = {
                        'schoolDetails.location.city': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                default:
                    locationSearch = {}
                    break;
            }
        }

        let pipeline: any = [
            {
                $match: {
                    type: foodChartType,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'schoolAdminId',
                    foreignField: '_id',
                    as: 'schoolDetails',
                },
            },
            {
                $unwind: '$schoolDetails',
            },


            {
                $match: {
                    ...locationSearch
                },
            },
        ];

        if (searchQuery) {
            pipeline.push({
                $match: {
                    schoolName: { $regex: searchQuery, $options: 'i' },
                },
            });
        }

        pipeline = [
            ...pipeline,
            {
                $group: {
                    _id: '$groupId',
                    record: { $first: '$$ROOT' },
                    count: { $sum: 1 },
                },
            },
            {
                $replaceRoot: {
                    newRoot: '$record',
                },
            },
            {
                $project: {
                    // Shape the output fields for the grouped documents
                    _id: 0,
                    groupId: '$groupId',
                    schoolAdminId: '$schoolAdminId',
                    city: '$schoolDetails.city',
                    address: '$schoolDetails.address',
                    schoolName: '$schoolDetails.schoolName',
                    details: '$schoolDetails.details',
                    status: '$isApproved',
                },
            },
            {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [{ $skip: skip }, { $limit: limit }],
                },
            },
            {
                $unwind: {
                    path: '$metadata',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        const [data, total] = await Promise.all([
            this.vendorDayRepository.aggregate(pipeline),
            this.vendorDayRepository.countDocuments({}),
        ]);

        const totalFiltered = data[0]?.metadata?.total || 0;

        const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
            getPaginationDetails({
                data: data?.data,
                count: totalFiltered,
                limit: limit,
                skip,
            });

        const meta = {
            totalFiltered,
            total,
            currentPage: page,
            perPage: limit,
            totalPage,
            startIndex,
            endIndex,
            currentPageFilteredCount,
            searchQuery: searchQuery,
        };
        return this.responseService.success(
            await i18n.translate('messages.queryRetrieved'),
            { data: data[0]?.data || [] },
            meta,
        );
    }


    async approveFoodChart(
        userId: string,
        payload: ApproveFoodChartDto,
        i18n: I18nContext,
        type: string,
    ) {
        const result = (
            await this.vendorDayRepository.findOne({ groupId: payload.groupId })
        )?.toObject();

        if (!result) {
            throw new BadRequestException(i18n.translate('messages.recoredNotFound'));
        }

        if (result.type !== type) {
            throw new ForbiddenException(i18n.translate('messages.notAllow'));
        }

        await this.vendorDayRepository.updateMany(
            {
                groupId: payload.groupId,
                type: type,
            },
            {
                isApproved: payload.status,
                approvedBy: userId,
            },
        );

        return this.responseService.success(
            await i18n.translate('messages.foodChartUpdate'),
            null,
            null,
        );
    }

}
