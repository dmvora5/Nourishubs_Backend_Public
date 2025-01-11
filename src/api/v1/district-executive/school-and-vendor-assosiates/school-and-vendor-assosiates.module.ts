import { Module } from '@nestjs/common';
import { SchoolAndVendorAssosiatesService } from './school-and-vendor-assosiates.service';
import { SchoolAndVendorAssosiatesController } from './school-and-vendor-assosiates.controller';
import { UsersModule } from '../../users/users.module';
import { VendorManagementModule } from 'src/modules/vendor-management/vendor-management.module';
@Module({
  imports:[
    UsersModule,
    VendorManagementModule
  ],
  controllers: [SchoolAndVendorAssosiatesController],
  providers: [SchoolAndVendorAssosiatesService],
})
export class SchoolAndVendorAssosiatesModule {}
