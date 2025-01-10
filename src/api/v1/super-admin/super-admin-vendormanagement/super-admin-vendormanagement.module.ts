import { Module } from '@nestjs/common';
import { SuperAdminVendormanagementService } from './super-admin-vendormanagement.service';
import { SuperAdminVendormanagementController } from './super-admin-vendormanagement.controller';
import { VendorManagementModule } from 'src/modules/vendor-management/vendor-management.module';
import { VerificationRequestsModule } from 'src/modules/verification-requests/verification-requests.module';

@Module({
  imports: [
    VendorManagementModule,
    VerificationRequestsModule
  ],
  controllers: [SuperAdminVendormanagementController],
  providers: [SuperAdminVendormanagementService],
})
export class SuperAdminVendormanagementModule { }
