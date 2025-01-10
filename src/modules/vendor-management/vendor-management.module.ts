import { Module } from '@nestjs/common';
import { VendorManagementService } from './vendor-management.service';
import { VerificationRequestsModule } from '../verification-requests/verification-requests.module';
import { UsersModule } from 'src/api/v1/users/users.module';
import { UsernotificationModule } from 'src/api/v1/usernotification/usernotification.module';

@Module({
  imports:[
    UsersModule,
    UsernotificationModule,
    VerificationRequestsModule
  ],
  providers: [VendorManagementService],
  exports: [VendorManagementService],
})
export class VendorManagementModule {}
