import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { UserRepository } from '../../users/user.repository';
import { BasicQueryDto, CommonResponseService, getPaginationDetails } from '@app/shared';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { I18nContext } from 'nestjs-i18n';
import { UpdateUserDto } from '../../users/dtos/update-user.dto';
import { UsernotificationService } from '../../usernotification/usernotification.service';

@Injectable()
export class UserManagementService {
    constructor(
        private readonly userService: UsersService,
        private readonly userRepository: UserRepository,
        private readonly responseService: CommonResponseService,
        private readonly userNotificationService: UsernotificationService,
    ) { }

    async createUserWithRoleAndPermission(role: string, payload: CreateUserDto, i18n: I18nContext, userId: string) {
        return this.userService.createUserWithRoleAndPermission(role, payload, i18n, userId)
    }


    async getAllUsers(
        query: BasicQueryDto,
        i18n: I18nContext,

    ) {
        const { page, limit, searchQuery, orderBy = { createdAt: -1 } } = query;

        const skip = (page - 1) * limit;

        const baseFilter = { status: 'active' };
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

        const [permissions, total, totalFiltered] = await Promise.all([
            this.userRepository.getAllUserWithRoles({ filter, skip, limit, orderBy }),
            this.userRepository.countDocuments({ status: 'active' }), // Count all non-deleted users
            this.userRepository.countDocuments(filter),
        ]);

        const { totalPage, startIndex, endIndex, currentPageFilteredCount } = getPaginationDetails({
            data: permissions,
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
        const users = {
            "users": permissions,
            "suspended_accounts": suspended
        };
        return this.responseService.success(await i18n.translate('messages.usersRetrieved'), users, meta);
    }

    async updateStatus(userId: string, status: string, i18n: I18nContext) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new BadRequestException(await i18n.translate('messages.userNotFound'));

        // Update common status
        if (status) {
            if (!['active', 'suspended', 'deleted'].includes(status)) {
                throw new BadRequestException('Invalid status value');
            }
            user.status = status;
        }
        await user.save();


        await this.userNotificationService.createNotification({
            userId: userId,
            title: status === "suspended" ? "You are Suspended" : "You are Active",
            reason: "",
            childId: null
        });

        const result = {
            userData: user,
        };
        return this.responseService.success(await i18n.translate('messages.userUpdated'), result, {});
    }

    async softDeleteUser(id: string, i18n: I18nContext) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new BadRequestException(await i18n.translate('messages.userNotFound'));

        // Update the status to "deleted"
        user.status = 'deleted';
        user.save();
        const users = {
            "userData": user
        }
        return this.responseService.success(await i18n.translate('messages.userDeleted'), users, {});
    }

    async updateUser(id: string, payload: UpdateUserDto, i18n: I18nContext) {
        try {
            const { email, ...userData } = payload;
            console.log("user=======>", payload);

            // Check if the user exists
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new NotFoundException(await i18n.translate('messages.userNotFound'));
            }
            // Check if the email exists and is not the current user's email
            if (email && email !== user.email) {
                const emailExist = await this.userRepository.findOne({ email });
                if (emailExist) {
                    throw new ConflictException(await i18n.translate('messages.emailExists'));
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

                // Update the user fields (exclude fields like email if not allowed to update)
                Object.assign(user, userData);
            if (email) {
                user.email = email; // Update email if provided
            }
            const updatedUser = await user.save();
            const result = {
                userData: updatedUser,
            };
            return this.responseService.success(await i18n.translate('messages.userUpdated'), result, {});
        } catch (error) {
            if (error.code === 11000) { // MongoDB duplicate key error code
                throw new ConflictException(await i18n.translate('messages.emailExists'));
            }
            throw error;
        }
    }

    async getUserById(id: string, i18n: I18nContext) {
        try {
            // Find user by ID
            let user = await this.userRepository.findUserWithPermissions(id);

            // const user = await this.userModel.findById(id, "-permissions -__v").populate({
            //     path: 'role',
            //     select: 'name',
            //     transform: (doc) => (doc ? doc.name : null),
            // }).exec();

            // Check if user exists
            if (!user) {
                throw new NotFoundException(await i18n.translate('messages.userNotFound'));
            }
            const result = {
                userData: user,
            };
            return this.responseService.success(await i18n.translate('messages.userRetrieved'), result, {});
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

    async getSuspendedAccounts(
        query: BasicQueryDto,
        i18n: I18nContext,

    ) {
        try {

            const { page, limit, searchQuery, orderBy = { createdAt: -1 } } = query;

            const skip = (page - 1) * limit;

            // Filter for suspended users
            const baseFilter = { status: 'suspended' };
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
}
