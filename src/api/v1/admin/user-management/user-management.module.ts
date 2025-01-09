import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { UsersModule } from '../../users/users.module';
import { UsernotificationModule } from '../../usernotification/usernotification.module';

@Module({
  imports:[
    UsersModule,
    UsernotificationModule
  ],
  controllers: [UserManagementController],
  providers: [UserManagementService],
})
export class AdminUserManagementModule {}
