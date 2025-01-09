import { Module } from '@nestjs/common';
import { VendorProfileService } from './vendor-profile.service';
import { VendorProfileController } from './vendor-profile.controller';
import { UsersModule } from '../../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorRequest, VendorRequestSchema } from './models/vendorRequest.schemas';
import { VendorRequestsRepository } from './vendor-request.repository';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: VendorRequest.name, schema: VendorRequestSchema }
    ])
  ],
  controllers: [VendorProfileController],
  providers: [VendorProfileService, VendorRequestsRepository],
  exports: [VendorProfileService, VendorRequestsRepository]
})
export class VendorProfileModule {}
