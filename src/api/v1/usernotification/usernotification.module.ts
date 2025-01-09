import { Module } from '@nestjs/common';
import { UsernotificationService } from './usernotification.service';
import { UsernotificationController } from './usernotification.controller';
import { UserNotificationRepository } from './usernotification.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserNotification, UserNotificationSchema } from './models/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserNotification.name,
        schema: UserNotificationSchema,
      },
    ]),
  ],
  controllers: [UsernotificationController],
  providers: [UsernotificationService, UserNotificationRepository],
  exports: [UsernotificationService, UserNotificationRepository],
})
export class UsernotificationModule { }
