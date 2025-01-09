import { Injectable } from '@nestjs/common';
import { UserNotificationRepository } from './usernotification.repository';
import { CommonResponseService } from '@app/common/services';
import { I18nContext } from 'nestjs-i18n';
import { BasicQueryDto, getPaginationDetails } from '@app/common';

@Injectable()
export class UsernotificationService {
    constructor(
        private readonly userNotificationRepository: UserNotificationRepository,
        private readonly responseService: CommonResponseService,
    ) { }


    async createNotification({ userId, childId, title, reason }) {
        return this.userNotificationRepository.create({
            user: userId,
            childId: childId || null,
            title,
            reason,
        });
    }


    async getUserStatusNotifications(userId: string, userRole: string, i18n: I18nContext) {

        const filter = { user: userId, isViewd: false, type: "Status" }

        const notifications = await this.userNotificationRepository.getUsersNotifications({ filter, role: userRole });
        return this.responseService.success(
            await i18n.translate('messages.notificationsRetrieved'),
            notifications,
            null,
        );
    }


    async getNotificationLists(
        userId: string,
        userRole: string,
        query: BasicQueryDto,
        i18n: I18nContext
    ) {

        const { page, limit, searchQuery } = query;

        const skip = page && limit ? (page - 1) * limit : 0;

        const filter = searchQuery
            ? {
                $or: [
                    { title: { $regex: searchQuery, $options: 'i' } },
                    { reason: { $regex: searchQuery, $options: 'i' } }
                ],
            }
            : {};

        const findQuery = {
            ...filter,
            user: userId,
        };


        const [notifications, total, totalFiltered] = await Promise.all([
            this.userNotificationRepository.getUsersNotifications({
                filter: findQuery,
                limit,
                skip,
                orderBy: { createdAt: -1 },
                role: userRole
            }),
            this.userNotificationRepository.countDocuments({}),
            this.userNotificationRepository.countDocuments(findQuery),
        ]);

        const paginationMeta = page && limit
            ? getPaginationDetails({
                data: notifications,
                count: totalFiltered,
                limit,
                skip,
            })
            : {};

        const meta = page && limit ? {
            totalFiltered,
            total,
            currentPage: page,
            perPage: limit,
            ...paginationMeta,
            searchQuery,
        } : {};


        return this.responseService.success(
            i18n.translate('messages.notificationsRetrieved'),
            { notifications },
            meta
        );

    }


    async readNotifications(userId: string, notificationId, i18n: I18nContext) {
        await this.userNotificationRepository.findOneAndUpdate(
            { _id: notificationId, user: userId },
            {
                isViewd: true,
            },
        );
        return this.responseService.success(await i18n.translate(''), null, null);
    }

    async readAllNotifications(userId: string, i18n: I18nContext) {
        await this.userNotificationRepository.updateMany(
            {
                user: userId,
                isViewd: false,
            },
            {
                isViewd: true,
            },
        );

        return this.responseService.success(
            await i18n.translate('messages.readAllNotifications'),
            null,
            null,
        );
    }

}
