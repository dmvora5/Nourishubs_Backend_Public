import { Injectable, Logger } from "@nestjs/common";
import { FoodCategory } from "./models/foodcategory.schema";
import { AbstractRepository } from "@app/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";




@Injectable()
export class FoodCategoryRepository extends AbstractRepository<FoodCategory> {
    protected readonly logger = new Logger(FoodCategoryRepository.name);

    constructor(
        @InjectModel(FoodCategory.name) protected foodCategoryModel: Model<FoodCategory>,
    ) {
        super(
            foodCategoryModel,
        );
    }


    async getFoodcategoryWithModifierAndDishes({vendorId}): Promise<any> {
        return this.foodCategoryModel
          .find({
            vendor: vendorId,
          })
          .populate({
            path: 'dishes',
            populate: {
              path: 'modifierIds',
              populate: {
                path: 'dishIds', // Example for a nested reference in the `Dish` schema
              }, // Example for a nested reference in the `Dish` schema
            },
          })
          .lean(true)
          .exec();
    }


}