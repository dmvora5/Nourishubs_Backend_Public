import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MealSelectionModule } from 'src/modules/meal-selection/meal-selection.module';
import { OrdersModule } from 'src/modules/orders/orders.module';
import { UsersModule } from '../../users/users.module';
import { VendorManagementModule } from 'src/modules/vendor-management/vendor-management.module';
import { VerificationRequestsModule } from 'src/modules/verification-requests/verification-requests.module';

@Module({
  imports: [
    OrdersModule,
    UsersModule,
    MealSelectionModule,
    VendorManagementModule,
    VerificationRequestsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]

})
export class DistrictExecutiveOrderManagement { }
