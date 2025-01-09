import { Module } from '@nestjs/common';
import { VendorManagementService } from './vendor-management.service';
import { VendorManagementController } from './vendor-management.controller';

@Module({
  controllers: [VendorManagementController],
  providers: [VendorManagementService],
})
export class VendorManagementModule {}
