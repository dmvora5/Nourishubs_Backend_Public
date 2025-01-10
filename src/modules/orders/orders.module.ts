import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrderSchema } from './models/orders.schemas';
import { MealSelectionModule } from '../meal-selection/meal-selection.module';
import { OrdersRepository } from './order.repository';
import { KidModule } from '../kids/kid.module';
import { UsersModule } from 'src/api/v1/users/users.module';
import { UsernotificationModule } from 'src/api/v1/usernotification/usernotification.module';
@Module({
  imports:[
    MealSelectionModule,
    KidModule,
    UsernotificationModule,
    UsersModule,
    MongooseModule.forFeature([
      {name: Orders.name, schema: OrderSchema}
    ])
  ],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService, OrdersRepository]
})
export class OrdersModule {}
