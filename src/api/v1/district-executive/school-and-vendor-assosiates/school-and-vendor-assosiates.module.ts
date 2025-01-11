import { Module } from '@nestjs/common';
import { SchoolAndVendorAssosiatesService } from './school-and-vendor-assosiates.service';
import { SchoolAndVendorAssosiatesController } from './school-and-vendor-assosiates.controller';
import { UsersModule } from '../../users/users.module';

@Module({
  imports:[
    UsersModule
  ],
  controllers: [SchoolAndVendorAssosiatesController],
  providers: [SchoolAndVendorAssosiatesService],
})
export class SchoolAndVendorAssosiatesModule {}
