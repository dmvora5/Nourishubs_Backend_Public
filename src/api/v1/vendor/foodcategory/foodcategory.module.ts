import { Module } from '@nestjs/common';
import { FoodcategoryService } from './foodcategory.service';
import { FoodcategoryController } from './foodcategory.controller';
import { FoodCategoryRepository } from './foodcategory.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodCategory, FoodCategorySchema } from './models/foodcategory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FoodCategory.name, schema: FoodCategorySchema }
    ])
  ],
  controllers: [FoodcategoryController],
  providers: [FoodcategoryService, FoodCategoryRepository],
  exports: [FoodcategoryService, FoodCategoryRepository]
})
export class FoodcategoryModule { }
