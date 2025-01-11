import { Module } from '@nestjs/common';
import { SchoolAndVendorVerifyService } from './school-and-vendor-verify.service';
import { SchoolAndVendorVerifyController } from './school-and-vendor-verify.controller';
import { VerificationRequestsModule } from 'src/modules/verification-requests/verification-requests.module';

@Module({
  imports: [
    VerificationRequestsModule
  ],
  controllers: [SchoolAndVendorVerifyController],
  providers: [SchoolAndVendorVerifyService],
})
export class SchoolAndVendorVerifyModule { }
