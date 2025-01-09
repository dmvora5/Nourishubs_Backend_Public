import { Module } from '@nestjs/common';
import { ParentDashboardService } from './parent-dashboard.service';
import { ParentDashboardController } from './parent-dashboard.controller';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [
    UsersModule
  ],
  controllers: [ParentDashboardController],
  providers: [ParentDashboardService],
})
export class ParentDashboardModule { }
