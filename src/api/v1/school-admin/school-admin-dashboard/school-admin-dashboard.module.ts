import { Module } from '@nestjs/common';
import { SchoolAdminDashboardService } from './school-admin-dashboard.service';
import { SchoolAdminDashboardController } from './school-admin-dashboard.controller';
import { KidModule } from 'src/modules/kids/kid.module';
import { UsernotificationModule } from '../../usernotification/usernotification.module';
import { UsersModule } from '../../users/users.module';
import { VerificationRequestsModule } from 'src/modules/verification-requests/verification-requests.module';

@Module({
  imports:[
    KidModule,
    UsernotificationModule,
    VerificationRequestsModule,
    UsersModule
  ],
  controllers: [SchoolAdminDashboardController],
  providers: [SchoolAdminDashboardService],
})
export class SchoolAdminDashboardModule {}
