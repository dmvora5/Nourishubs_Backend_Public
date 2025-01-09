import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dish, DishSchema } from './models/dish.schema';
import { DishRepository } from './dish.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dish.name, schema: DishSchema }
    ])
  ],
  controllers: [DishController],
  providers: [DishService, DishRepository],
  exports: [DishService, DishRepository]
})
export class DishModule { }
