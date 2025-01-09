import { Module } from '@nestjs/common';
import { ParentOrdersService } from './parent-orders.service';
import { ParentOrdersController } from './parent-orders.controller';
import { OrdersModule } from 'src/modules/orders/orders.module';
import { MealSelectionModule } from 'src/modules/meal-selection/meal-selection.module';
import { KidModule } from 'src/modules/kids/kid.module';

@Module({
  imports: [
    OrdersModule,
    MealSelectionModule,
    KidModule
  ],
  controllers: [ParentOrdersController],
  providers: [ParentOrdersService],
})
export class ParentOrdersModule {}
