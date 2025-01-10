import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { OtherUserRepository, ParentRepository, SchoolMembersRepository, SchoolRepository, UserRepository, VendorRepository } from './user.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { I18nContext } from 'nestjs-i18n';
import { IRole, IUser, LOCATION, ROLES } from '@app/common';
import { CommonResponseService } from '@app/common/services';
import { SuspenDto } from './dtos/suspend.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsernotificationService } from '../usernotification/usernotification.service';
import { BasicQueryDto, getPaginationDetails } from '@app/common';
const PENDING_VEROFICATION_ROLES = [
    ROLES.VENDOR,
    ROLES.SCHOOL
];


interface GetUsersInputs {
    query: BasicQueryDto;
    i18n: I18nContext,
    user: IUser,
    roles: string[],
    location?: string,
    baseFilter?: Object,
    select?: string
}

@Injectable()
export class UsersService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly vendorRepository: VendorRepository,
        private readonly schoolRepository: SchoolRepository,
        private readonly parentRepository: ParentRepository,
        private readonly otherUserRepository: OtherUserRepository,
        private readonly responseService: CommonResponseService,
        private readonly userNotificationService: UsernotificationService,
        private readonly schoolMembersRepository: SchoolMembersRepository
    ) { }

    async findUserWithPermissions(id: string) {
        return this.userRepository.findUserWithPermissions(id);
    }

    async createUserWithRoleAndPermission(
        loginUserRole: IRole,
        payload: CreateUserDto,
        i18n: I18nContext,
        loggedInUserId: string,
    ) {

        if (!loginUserRole.childRoles.includes(payload.role)) {
            throw new ForbiddenException(i18n.translate("messages.roleNotAssign"));
        }


        const rolesPermisiions = new Map(loginUserRole?.permissions?.map(ele => [ele?.permission, new Set(ele?.subPermissions)]));


        for (const permission of payload.permissions || []) {

            const existPermission = rolesPermisiions.get(permission.permission);

            if (!existPermission) {
                throw new ForbiddenException("messages.permissionsNotAssign");
            }

            for (const subPermission of permission?.subPermissions || []) {
                if (!existPermission.has(subPermission)) {
                    throw new ForbiddenException("messages.subPermissionsNotAssign");
                }
            }
        }


        const { ...userData } = payload;

        const emailExist = (await this.userRepository.findOne({ email: userData.email }))?.toObject();
        if (emailExist) {
            throw new UnprocessableEntityException(i18n.translate('messages.emailExists'));
        }


        const insertData: any = {
            ...userData,
            createdBy: loggedInUserId,
            verificationStatus: PENDING_VEROFICATION_ROLES.includes(payload.role) ? "pending" : "approved",
            location: {
                latitude: payload?.latitude,
                address: payload?.address,
                longitude: payload?.longitude,
                type: 'Point',
                coordinates: [payload?.longitude, payload?.latitude],
                state: payload?.state,
                city: payload?.city,
                district: payload?.district,
                country: payload?.country,
            },
        }

        let newUser;

        switch (userData.role) {
            case ROLES.VENDOR:
                newUser = await this.vendorRepository.create(insertData);
                break;
            case ROLES.SCHOOL:
                newUser = await this.schoolRepository.create(insertData);
                break;
            case ROLES.PARENT:
                newUser = await this.parentRepository.create(insertData);
                break;
            case ROLES.TEACHER:
                newUser = await this.schoolMembersRepository.create(insertData);
                break;
            case ROLES.SCHOOLOTHERS:
                newUser = await this.schoolMembersRepository.create(insertData);
                break;
            default:
                newUser = await this.otherUserRepository.create(insertData);
        }


        const response = {
            userData: newUser
        }
        return this.responseService.success(i18n.translate('messages.userCreated'), response, {});

    }


    async updateStatus(loginUserRole: IRole, payload: SuspenDto, userId: string, i18n: I18nContext) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new BadRequestException(i18n.translate('messages.userNotFound'));

        if (user.status === payload.status) {
            throw new BadRequestException(i18n.translate('messages.statusIsSame'));
        }


        if (!loginUserRole.childRoles?.includes(user.role)) {
            throw new ForbiddenException("messages.statusNotChange");
        }

        // Update common status
        if (payload.status) {
            if (!['active', 'suspended', 'deleted'].includes(payload.status)) {
                throw new BadRequestException('messages.invalidStatus');
            }
            user.status = payload.status;
        }
        await user.save();

        let title;

        switch (payload.status) {
            case 'active':
                title = 'Your account is activeted';
                break;
            case 'suspended':
                title = 'Your are suspended';
                break;
            default:
                break;
        }


        await this.userNotificationService.createNotification({
            userId: userId,
            title: title,
            reason: payload.reason,
            childId: null
        });


        const result = {
            userData: user,
        };
        return this.responseService.success(i18n.translate('messages.userUpdated'), result, {});
    }

    async updateUser(loginUserRole: IRole, id: string, payload: UpdateUserDto, i18n: I18nContext) {
        const { email, ...userData } = payload;

        const user = (await this.userRepository.findById(id))?.toObject();
        if (!user) {
            throw new NotFoundException(await i18n.translate('messages.userNotFound'));
        }

        if (!loginUserRole.childRoles?.includes(user.role)) {
            throw new ForbiddenException();
        }

        if (email && email !== user.email) {
            const emailExist = await this.userRepository.findOne({ email });
            if (emailExist) {
                throw new ConflictException(i18n.translate('messages.emailExists'));
            }
        }

        user.location = {
            latitude: payload?.latitude,
            address: payload?.address,
            longitude: payload?.longitude,
            type: 'Point',
            coordinates: [payload?.longitude, payload?.latitude],
            state: payload?.state,
            city: payload?.city,
            district: payload?.district,
            country: payload?.country,
        },

            Object.assign(user, userData);
        if (email) {
            user.email = email;
            user.isEmailVerified = false;
        }
        let updatedUser;

        switch (user.role) {
            case ROLES.VENDOR:
                updatedUser = await this.vendorRepository.findByIdAndUpdate(user?.id, user);
                break;
            case ROLES.SCHOOL:
                updatedUser = await this.schoolRepository.findByIdAndUpdate(user?.id, user);
                break;
            case ROLES.PARENT:
                updatedUser = await this.parentRepository.findByIdAndUpdate(user?.id, user);
                break;
            default:
                updatedUser = await this.otherUserRepository.findByIdAndUpdate(user?.id, user);
        }

        const result = {
            userData: updatedUser,
        };
        return this.responseService.success(await i18n.translate('messages.userUpdated'), result, {});

    }


    async softDeleteUser(loginUserRole: IRole, id: string, i18n: I18nContext) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new BadRequestException(i18n.translate('messages.userNotFound'));


        if (!loginUserRole.childRoles?.includes(user.role)) {
            throw new ForbiddenException();
        }

        user.status = 'deleted';

        await user.save();

        const users = {
            userData: user
        }

        return this.responseService.success(i18n.translate('messages.userDeleted'), users, {});
    }


    async getUserById(loginUserRole: IRole, id: string, i18n: I18nContext) {
        try {
            const user = await this.findUserWithPermissions(id);

            if (!user) {
                throw new NotFoundException(i18n.translate('messages.userNotFound'));
            }


            if (!loginUserRole.childRoles?.includes(user.role)) {
                throw new ForbiddenException();
            }

            const result = {
                userData: user,
            };
            return this.responseService.success(i18n.translate('messages.userRetrieved'), result, {});
        } catch (error) {
            throw error;
        }
    }

    async getLoginUserById(i18n: I18nContext, loginUserId: string) {
        try {
            const user = await this.userRepository.findById(loginUserId);

            if (!user) {
                throw new NotFoundException(i18n.translate('messages.userNotFound'));
            }

            return this.responseService.success(i18n.translate('messages.userRetrieved'), { user }, {});
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers(
        query: BasicQueryDto,
        i18n: I18nContext,
        loggedInUserId?: string, // Optional loggedInUserId

    ) {
        const { page, limit, searchQuery, orderBy = { createdAt: -1 } } = query;

        const skip = (page - 1) * limit;
        const baseFilter: any = { status: 'active' };
        if (loggedInUserId) {
            baseFilter.createdBy = loggedInUserId;
        }
        const searchFilter = searchQuery
            ? {
                $or: [
                    { email: { $regex: searchQuery, $options: 'i' } },
                    { first_name: { $regex: searchQuery, $options: 'i' } },
                    { last_name: { $regex: searchQuery, $options: 'i' } }
                ]
            }
            : {};

        const filter = { ...baseFilter, ...searchFilter };

        const [users, total, totalFiltered] = await Promise.all([
            this.userRepository.getAllUserWithRoles({ filter, skip, limit, orderBy }),
            this.userRepository.countDocuments({ status: 'active' }), // Count all non-deleted users
            this.userRepository.countDocuments(filter),
        ]);

        const { totalPage, startIndex, endIndex, currentPageFilteredCount } = getPaginationDetails({
            data: users,
            count: totalFiltered,
            limit,
            skip,
        })

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
            orderBy
        }

        const suspended = await this.userRepository.countDocuments({ status: 'suspended' }); // Count all non-deleted users
        const data = {
            "users": users,
            "suspended_accounts": suspended
        };
        return this.responseService.success(await i18n.translate('messages.usersRetrieved'), data, meta);
    }

    async getAllUsersWithFilters({
        query,
        i18n,
        user,
        roles = [],
        location,
        baseFilter = { status: 'active' },
        select,
    }: GetUsersInputs) {
        const { page = 1, limit = 10, searchQuery, orderBy = { createdAt: -1 } } = query;

        const skip = (page - 1) * limit;

        const searchFilter = searchQuery
            ? {
                $or: [
                    { email: { $regex: searchQuery, $options: 'i' } },
                    { first_name: { $regex: searchQuery, $options: 'i' } },
                    { last_name: { $regex: searchQuery, $options: 'i' } }
                ]
            }
            : {};

        let filter: any = { ...baseFilter, ...searchFilter };

        if (roles && roles.length) {
            filter = { ...filter, role: { $in: roles } };
        }

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
                    locationSearch = {};
                    break;
            }
        }

        filter = {
            ...filter,
            ...locationSearch
        }

        const [users, total, totalFiltered] = await Promise.all([
            this.userRepository.getAllUserWithRoles({ filter, skip, limit, orderBy, select }),
            this.userRepository.countDocuments({ status: 'active' }), // Count all non-deleted users
            this.userRepository.countDocuments(filter),
        ]);

        const { totalPage, startIndex, endIndex, currentPageFilteredCount } = getPaginationDetails({
            data: users,
            count: totalFiltered,
            limit,
            skip,
        })

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
            orderBy
        }

        return this.responseService.success(await i18n.translate('messages.usersRetrieved'), { users }, meta);


    }

    async getSuspendedAccounts(
        query: BasicQueryDto,
        i18n: I18nContext,
        loggedInUserId?: string, // Optional loggedInUserId

    ) {
        try {

            const { page, limit, searchQuery, orderBy = { createdAt: -1 } } = query;

            const skip = (page - 1) * limit;

            // Filter for suspended users
            const baseFilter: any = { status: 'active' };
            if (loggedInUserId) {
                baseFilter.createdBy = loggedInUserId;
            }
            const searchFilter = searchQuery
                ? {
                    $or: [
                        { email: { $regex: searchQuery, $options: 'i' } },
                        { first_name: { $regex: searchQuery, $options: 'i' } },
                        { last_name: { $regex: searchQuery, $options: 'i' } }
                    ]
                }
                : {};
            const filter = { ...baseFilter, ...searchFilter };
            const [users, total, totalFiltered] = await Promise.all([
                this.userRepository.findWithPagination(filter, { skip, limit }, "-permissions"),
                this.userRepository.countDocuments({ status: 'suspended' }), // Count all users
                this.userRepository.countDocuments(filter), // Count suspended users
            ]);

            const { totalPage, startIndex, endIndex, currentPageFilteredCount } = getPaginationDetails({
                data: users,
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
                orderBy
            };
            const usersdata = {
                "users": users,
            };
            return this.responseService.success(await i18n.translate('messages.suspendedUsersRetrieved'), usersdata, meta);
        } catch (error) {
            throw error;
        }
    }

    async statistics() {
        const suspended = await this.userRepository.countDocuments({ status: 'suspended' }); // Count all non-deleted users
        const users = {
            "suspended_accounts": suspended
        };
        return this.responseService.success("", users, {});
    }

}
