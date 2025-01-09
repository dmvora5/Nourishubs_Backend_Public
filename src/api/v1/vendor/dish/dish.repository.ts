import { Injectable, Logger } from "@nestjs/common";
import { Dish } from "./models/dish.schema";
import { Connection, Model } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { AbstractRepository } from "@app/common";





@Injectable()
export class DishRepository extends AbstractRepository<Dish> {
    protected readonly logger = new Logger(DishRepository.name);

    constructor(
        @InjectModel(Dish.name) protected dishModel: Model<Dish>,
    ) {
        super(
            dishModel,
        );
    }


    async getAllDishisesWithPaginations({ filter, skip, limit, orderBy }) {
        return this.dishModel
            .find(filter)
            .populate({
                path: 'vendor',
            })
            .populate({
                path: 'modifierIds',
            })
            .populate({
                path: 'categoryIds',
            })
            .skip(skip)
            .limit(limit)
            .sort(orderBy)
            .exec();
    }

}