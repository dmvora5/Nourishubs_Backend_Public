import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MealSelectionModule } from 'src/modules/meal-selection/meal-selection.module';
import { OrdersModule } from 'src/modules/orders/orders.module';
import { UsersModule } from '../../users/users.module';
import { VendorManagementModule } from 'src/modules/vendor-management/vendor-management.module';
@Module({
  imports: [
    MealSelectionModule,
    OrdersModule,
    UsersModule,
    VendorManagementModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]

})
export class SuperAdminOrderManagement { }
