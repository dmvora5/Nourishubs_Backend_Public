import { BasicQueryDto, getPaginationDetails, IUser, LOCATION, REQUEST_USER_TYPE, ROLES } from '@app/common';
import { CommonResponseService } from '@app/common/services';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { UserNotificationRepository } from 'src/api/v1/usernotification/usernotification.repository';
import { VendorRepository } from 'src/api/v1/users/user.repository';
import { SuspenVendorDto } from './dtos/vendors.dtos';
import { VerificationRequestsService } from '../verification-requests/verification-requests.service';

@Injectable()
export class VendorManagementService {

    constructor(
        private readonly userRepository: VendorRepository,
        private readonly verificationRequestService: VerificationRequestsService,
        private readonly userNotificationRepository: UserNotificationRepository,
        private readonly responseService: CommonResponseService,
    ) { }


    async allVendors(
        query: BasicQueryDto,
        user: IUser,
        location: string,
        i18n: I18nContext,
    ) {
        const { page, limit, searchQuery, orderBy = { createdAt: -1 } } = query;

        const skip = page && limit ? (page - 1) * limit : 0;
        const commanFilter: any = { role: ROLES.VENDOR };

        let locationSearch = {};
        if (location) {
            switch (location) {
                case LOCATION.COUNTRY:
                    locationSearch = {
                        'location.country': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.STATE:
                    locationSearch = {
                        'location.state': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.DISTRICT:
                    locationSearch = {
                        'location.district': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.CITY:
                    locationSearch = {
                        'location.city': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        const searchFilter = searchQuery
            ? {
                $or: [
                    { first_name: { $regex: searchQuery, $options: 'i' } },
                    { last_name: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                    // { 'location.country': { $regex: searchQuery, $options: 'i' } },
                ],
            }
            : {};



        const filter = { ...searchFilter, ...commanFilter, ...locationSearch };
        console.log(filter);
        const [vendors, total, totalFiltered, pendingRequests] = await Promise.all([
            this.userRepository.findWithPagination(filter, { skip, limit, orderBy }),
            this.userRepository.countDocuments(commanFilter), // Count all non-deleted users
            this.userRepository.countDocuments({ ...searchFilter, ...commanFilter, ...locationSearch }),
            this.verificationRequestService.getRequestCounts({
                requestStatus: 'OPEN',
                type: 'DOCUMENTVERIFICATION',
                userType: REQUEST_USER_TYPE.VENDOR
            }),
        ]);

        const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
            getPaginationDetails({
                data: vendors,
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

        const resData = {
            documentVerificationRequestsCount: pendingRequests,
            vendors,
        };

        return this.responseService.success(
            await i18n.translate('messages.usersRetrieved'),
            resData,
            meta,
        );
    }

    async suspendVendor(id: string, payload: SuspenVendorDto, i18n: I18nContext) {
        const vendor = await this.userRepository.findById(id);

        if (!vendor) {
            throw new NotFoundException(
                await i18n.translate('messages.userNotFound'),
            );
        }

        if (vendor?.role !== ROLES.VENDOR) {
            throw new BadRequestException(i18n.translate('messages.userNotVendor'));
        }

        vendor.status = 'suspended';

        await vendor.save();

        await this.userNotificationRepository.create({
            userId: id,
            title: 'You are suspended',
            ...payload,
        });

        return this.responseService.success(
            await i18n.translate('messages.userSespended'),
            null,
        );
    }

    async getVendorById(id: string, i18n: I18nContext) {
        const vendor = (await this.userRepository.findUserWithRolenName(id))?.toObject();

        if (!vendor) {
            throw new NotFoundException(
                await i18n.translate('messages.userNotFound'),
            );
        }

        return this.responseService.success(
            await i18n.translate('messages.usersRetrieved'),
            vendor,
        );
    }
    async allApprovedVendors(
        user: IUser,
        location: string,
        i18n: I18nContext,
    ) {
        

        const commanFilter: any = { role: ROLES.VENDOR,verificationStatus:'approved' };

        let locationSearch = {};
        if (location) {
            switch (location) {
                case LOCATION.COUNTRY:
                    locationSearch = {
                        'location.country': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.STATE:
                    locationSearch = {
                        'location.state': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.DISTRICT:
                    locationSearch = {
                        'location.district': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                case LOCATION.CITY:
                    locationSearch = {
                        'location.city': {
                            $regex: `^${user.location.district.trim()}$`,
                            $options: 'i',
                        }
                    }
                    break;
                default:
                    break;
            }
        }
     



        const filter = { ...commanFilter, ...locationSearch };
        console.log(filter);
        const [vendors] = await Promise.all([
            this.userRepository.find(filter)
        ]);
        const meta = {
        };

        const resData = {
            "vendors":vendors,
        };

        return this.responseService.success(
            await i18n.translate('messages.usersRetrieved'),
            resData,
            meta,
        );
    }
}
