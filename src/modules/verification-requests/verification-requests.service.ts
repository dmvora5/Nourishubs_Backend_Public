import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CloseRequestDto, DocumentRequestDto, ThressHoldRequestDto } from './dtos/requests.dto';
import { I18nContext } from 'nestjs-i18n';
import { VerificationRequestsRepository } from './verification-request.repository';
import { BasicQueryDto, getPaginationDetails, IUser, LOCATION, REQUEST_STATUS, REQUEST_USER_TYPE, VERIFICATION_TYPE } from '@app/common';
import { CommonResponseService } from '@app/common/services';
import mongoose from 'mongoose';
import { UserRepository } from 'src/api/v1/users/user.repository';
import { UserNotificationRepository } from 'src/api/v1/usernotification/usernotification.repository';

@Injectable()
export class VerificationRequestsService {

    constructor(
        private readonly verificationRequestRepository: VerificationRequestsRepository,
        private readonly userRepository: UserRepository,
        private readonly userNotificationRepository: UserNotificationRepository,
        private readonly responseService: CommonResponseService,

    ) { }

    async generateDocumentRequest(
        userId: string,
        payload: DocumentRequestDto,
        requestUserType: string,
        i18n?: I18nContext
    ) {
        await this.verificationRequestRepository.findOneAndUpdate(
            {
                userId: userId,
                requestStatus: REQUEST_STATUS.OPEN,
                type: VERIFICATION_TYPE.DOCUMENTVERIFICATION,
                userType: requestUserType
            },
            {
                userId,
                ...payload,
                type: VERIFICATION_TYPE.DOCUMENTVERIFICATION,
                requestStatus: REQUEST_STATUS.OPEN,
                userType: requestUserType
            }
        );
        if (i18n) {
            return this.responseService.success(
                await i18n.translate('messages.requestSubmite'),
                null,
                {},
            );
        }

        return;
    }

    async generateThresholdrequest(
        userId: string,
        payload: ThressHoldRequestDto,
        i18n?: I18nContext
    ) {
        await this.verificationRequestRepository.findOneAndUpdate(
            {
                userId: userId,
                requestStatus: REQUEST_STATUS.OPEN,
                type: VERIFICATION_TYPE.THRESHOLD,
                userType: REQUEST_USER_TYPE.VENDOR
            },
            {
                minThresHold: payload.minThresHold,
                userId: userId,
                type: VERIFICATION_TYPE.THRESHOLD,
                requestStatus: REQUEST_STATUS.OPEN,
                userType: REQUEST_USER_TYPE.VENDOR
            },
        );


        if (i18n) {
            return this.responseService.success(
                await i18n.translate('messages.requestSubmite'),
                null,
                {},
            );
        }

        return;
    }

    async getDocumentRequestById(id: string, i18n: I18nContext) {
        const vendor = await this.verificationRequestRepository.findOne({ _id: id, type: VERIFICATION_TYPE.DOCUMENTVERIFICATION });

        if (!vendor) {
            throw new NotFoundException(
                await i18n.translate('messages.requestNotFound'),
            );
        }

        return this.responseService.success(
            await i18n.translate(''),
            vendor,
        );
    }

    async getAllPendingDocumentVerifications(
        query: BasicQueryDto,
        user: IUser,
        requestUserType: string,
        location: string,
        i18n: I18nContext,
        schoolId?: string,
    ) {
        const { page, limit, searchQuery, orderBy = { createdAt: -1 } } = query;

        const skip = page && limit ? (page - 1) * limit : 0;


        const searchFilter = searchQuery
            ? {
                $or: [
                    { 'userDetails.first_name': { $regex: searchQuery, $options: 'i' } },
                    { 'userDetails.last_name': { $regex: searchQuery, $options: 'i' } },
                    { 'userDetails.description': { $regex: searchQuery, $options: 'i' } },
                    // { 'userDetails.location.country': { $regex: searchQuery, $options: 'i' } },
                ],
            }
            : {};

        const filter: any = {};
        let locationSearch: any = {};

        if (schoolId) {
            filter.schoolId = mongoose.Types.ObjectId.createFromHexString(schoolId);
        }

        if (!schoolId && location) {
            switch (location) {
                case LOCATION.COUNTRY:
                    locationSearch = {
                        'userDetails.location.country': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.STATE:
                    locationSearch = {
                        'userDetails.location.state': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.DISTRICT:
                    locationSearch = {
                        'userDetails.location.district': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.CITY:
                    locationSearch = {
                        'userDetails.location.city': {
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

        const pipeline = [
            {
                $match: {
                    type: VERIFICATION_TYPE.DOCUMENTVERIFICATION,
                    requestStatus: REQUEST_STATUS.OPEN,
                    userType: requestUserType,
                    ...filter
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            { $unwind: '$userDetails' },
            {
                $match: {
                    ...locationSearch,
                    ...searchFilter,
                },
            },
            {
                $sort: orderBy,
            },
            {
                $facet: {
                    result: [
                        ...(page && limit ? [{ $skip: skip }, { $limit: +limit }] : []),
                        {
                            $project: {
                                schoolId: 1,
                                documents: 1,
                                first_name: '$userDetails.first_name',
                                last_name: '$userDetails.last_name',
                                email: '$userDetails.email',
                                country: '$userDetails.location.country',
                                description: '$userDetails.description',
                                district: '$userDetails.location.district',
                                createdAt: 1,
                            },
                        },
                    ],
                    totalCount: [
                        { $count: 'total' },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$totalCount',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        const [result] = await this.verificationRequestRepository.aggregate(pipeline);

        const totalFiltered = result?.totalCount?.total || 0;
        const responseResult = result?.result || [];

        const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
            page && limit
                ? getPaginationDetails({
                    data: responseResult,
                    count: totalFiltered,
                    limit,
                    skip,
                })
                : {};

        const meta = {
            totalFiltered,
            currentPage: page || null,
            perPage: limit || null,
            totalPage,
            startIndex,
            endIndex,
            currentPageFilteredCount,
            searchQuery,
        };

        return this.responseService.success(
            await i18n.translate('messages.requestsRetrieve'),
            { documentsVerificationRequests: responseResult },
            meta,
        );
    }

    async getAllPendingThresHoldVerifications(
        query: BasicQueryDto,
        user: IUser,
        location: string,
        i18n: I18nContext,
    ) {
        const { page, limit, searchQuery, orderBy = { createdAt: -1 } } = query;

        const skip = page && limit ? (page - 1) * limit : 0;

        const searchFilter = searchQuery
            ? {
                $or: [
                    {
                        'vendorDetails.first_name': {
                            $regex: searchQuery,
                            $options: 'i',
                        },
                    },
                    {
                        'vendorDetails.last_name': { $regex: searchQuery, $options: 'i' },
                    },
                    {
                        'vendorDetails.description': {
                            $regex: searchQuery,
                            $options: 'i',
                        },
                    },
                    // {
                    //     'vendorDetails.location.country': {
                    //         $regex: searchQuery,
                    //         $options: 'i',
                    //     },
                    // },
                ],
            }
            : {};

        let locationSearch: any = {};

        if (location) {
            switch (location) {
                case LOCATION.COUNTRY:
                    locationSearch = {
                        'userDetails.location.country': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.STATE:
                    locationSearch = {
                        'userDetails.location.state': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.DISTRICT:
                    locationSearch = {
                        'userDetails.location.district': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.CITY:
                    locationSearch = {
                        'userDetails.location.city': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                default:
                    locationSearch = {}
                    break;
            }

            const [result, total] = await Promise.all([
                this.verificationRequestRepository.aggregate([
                    {
                        $match: {
                            type: VERIFICATION_TYPE.THRESHOLD,
                            requestStatus: REQUEST_STATUS.OPEN,
                            userType: REQUEST_USER_TYPE.VENDOR
                        },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'userDetails',
                        },
                    },
                    { $unwind: '$userDetails' },
                    {
                        $match: {
                            ...searchFilter,
                            ...locationSearch
                        }
                    },
                    {
                        $facet: {
                            result:

                                [
                                    ...(page && limit ? [{ $skip: skip }, { $limit: +limit }] : []), // Apply pagination only if provided
                                    {
                                        $project: {
                                            vendorId: 1,
                                            // type: 1,
                                            minThresHold: 1,
                                            // documents: 1,
                                            // requestStatus: 1,
                                            // approved: 1,
                                            first_name: '$userDetails.first_name',
                                            last_name: '$userDetails.last_name',
                                            email: '$userDetails.email',
                                            country: '$userDetails.location.country',
                                            description: '$userDetails.description',
                                            createdAt: 1,
                                        },
                                    },
                                ],
                            totalCount: [
                                {
                                    $count: 'total',
                                },
                            ],
                        },
                    },
                    {
                        $unwind: '$totalCount',
                    },
                ]),
                this.verificationRequestRepository.countDocuments({
                    type: VERIFICATION_TYPE.THRESHOLD,
                    requestStatus: REQUEST_STATUS.OPEN,
                    userType: REQUEST_USER_TYPE.VENDOR
                }),
            ]);

            const totalFiltered = result.length > 0 ? result[0].totalCount.total : 0;
            const responseResult = result.length > 0 ? result[0].result : [];

            const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
                getPaginationDetails({
                    data: responseResult,
                    count: totalFiltered,
                    limit,
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
                searchQuery,
            };

            return this.responseService.success(
                await i18n.translate('messages.requestsRetrieve'),
                { thresHoldRequests: responseResult, thresholdRequestCount: totalFiltered },
                meta,
            );
        }
    }

    async closeDocumentRequest(
        reqId: string,
        payload: CloseRequestDto,
        requestUserType: string,
        i18n: I18nContext,
    ) {
        const requests = await this.verificationRequestRepository.find({
            vendorId: reqId,
            requestStatus: REQUEST_STATUS.OPEN,
            userType: requestUserType
        });


        if (!requests || requests.length === 0) {
            throw new NotFoundException(
                await i18n.translate('messages.requestNotFound'),
            );
        }

        await this.verificationRequestRepository.updateMany(
            {
                vendorId: reqId,
                requestStatus: REQUEST_STATUS.OPEN,
                userType: requestUserType
            },
            {
                requestStatus: REQUEST_STATUS.CLOSE,
                approved: payload.approved
            }
        )


        // Update the vendor's status
        await this.userRepository.findByIdAndUpdate(payload.userId, {
            verificationStatus: payload.approved ? 'approved' : 'rejected',
        });

        // Create a notification
        await this.userNotificationRepository.create({
            userId: payload.userId,
            title: payload.approved ? 'Request Approved' : 'Request Rejected',
            reason: payload.reason,
        });

        return this.responseService.success(
            await i18n.translate('messages.requestClose'),
            null,
        );
    }

    async closeThresHoldRequest(
        reqId: string,
        payload: CloseRequestDto,
        i18n: I18nContext,
    ) {
        const request = await this.verificationRequestRepository.findById(reqId);

        if (!request) {
            throw new NotFoundException(
                await i18n.translate('messages.requestNotFound'),
            );
        }

        if (request.requestStatus !== REQUEST_STATUS.OPEN) {
            throw new BadRequestException(
                await i18n.translate('messages.requestAlreadyClose'),
            );
        }

        request.requestStatus = REQUEST_STATUS.CLOSE;
        request.approved = payload.approved;

        await this.userRepository.findByIdAndUpdate(payload.userId, {
            thresHoldApprove: payload.approved ? 'approved' : 'rejected',
            minThresHold: request.minThresHold
        });

        await request.save();

        await this.userNotificationRepository.create({
            userId: payload.userId,
            title: payload.approved ? 'Request Approved' : 'Request Rejected',
            reason: payload.reason,
        });
        return this.responseService.success(
            await i18n.translate('messages.requestClose'),
            null,
        );
    }

    async getRequestCounts(filter: Object) {
        return this.verificationRequestRepository.countDocuments(filter);
    }


}
