import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserNotification } from "./models/notification.schema";
import { AbstractRepository, ROLES } from "@app/common";

interface NotificationInputs {
    filter: any,
    limit?: number,
    skip?: number,
    orderBy?: any,
    role: string
}


@Injectable()
export class UserNotificationRepository extends AbstractRepository<UserNotification> {
    protected readonly logger = new Logger(UserNotificationRepository.name);

    constructor(
        @InjectModel(UserNotification.name) protected userNotificationModel: Model<UserNotification>
    ) {
        super(
            userNotificationModel,
        );
    }


    async getUsersNotifications({ filter, limit, skip, orderBy, role }: NotificationInputs) {
        const query = this.userNotificationModel.find(filter, "-type")

        if (role === ROLES.PARENT) {
            query.populate({
                path: "user",
                select: "first_name last_name",
                transform: (doc) => doc?.first_name + doc?.last_name
            });
        }

        if (limit) {
            query
                .limit(limit)
                .skip(skip)
        }

        if (orderBy) {
            query.sort(orderBy)
        }

        return query.exec()
    }

}