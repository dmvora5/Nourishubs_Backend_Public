import { Module } from '@nestjs/common';
import { StaffManagementService } from './staff-management.service';
import { StaffManagementController } from './staff-management.controller';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [
    UsersModule
  ],
  controllers: [StaffManagementController],
  providers: [StaffManagementService],
})
export class StaffManagementModule { }
