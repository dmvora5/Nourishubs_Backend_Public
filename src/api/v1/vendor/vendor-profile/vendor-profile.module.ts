import { Module } from '@nestjs/common';
import { VendorProfileService } from './vendor-profile.service';
import { VendorProfileController } from './vendor-profile.controller';
import { UsersModule } from '../../users/users.module';
import { VerificationRequestsModule } from 'src/modules/verification-requests/verification-requests.module';

@Module({
  imports: [
    UsersModule,
    VerificationRequestsModule

  ],
  controllers: [VendorProfileController],
  providers: [VendorProfileService],
  exports: [VendorProfileService]
})
export class VendorProfileModule { }
