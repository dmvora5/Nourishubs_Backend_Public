import { Module } from '@nestjs/common';
import { MealSelectionService } from './meal-selection.service';
import { MealSelectionController } from './meal-selection.controller';
import { KidModule } from '../kids/kid.module';
import { FoodchartModule } from '../foodchart/foodchart.module';
import { DishModule } from 'src/api/v1/vendor/dish/dish.module';
import { ModifierModule } from 'src/api/v1/vendor/modifier/modifier.module';
import { FoodcategoryModule } from 'src/api/v1/vendor/foodcategory/foodcategory.module';
import { CartRepository } from './cart.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './models/cart.schemas';

@Module({
  imports: [
    KidModule,
    FoodchartModule,
    ModifierModule,
    FoodcategoryModule,
    DishModule,
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema }
    ])
  ],
  controllers: [MealSelectionController],
  providers: [MealSelectionService, CartRepository],
  exports: [MealSelectionService, CartRepository]
})
export class MealSelectionModule { }
