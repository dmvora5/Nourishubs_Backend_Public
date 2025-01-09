import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Modifier } from "./models/modifier.schema";
import { Connection, Model } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";



@Injectable()
export class ModifierRepository extends AbstractRepository<Modifier> {
    protected readonly logger = new Logger(ModifierRepository.name);

    constructor(
        @InjectModel(Modifier.name) protected modifierModel: Model<Modifier>,
    ) {
        super(
            modifierModel,
        );
    }


    async getAllModifierWithPagination({ filter, skip, limit, orderBy }) {
        return this.modifierModel
            .find(filter)
            .populate({
                path: 'vendor',
            })
            .populate({
                path: 'dishIds',
                populate: {
                    path: 'categoryIds',
                },
            })
            .skip(skip)
            .limit(limit)
            .sort(orderBy)
            .exec();
    }


    async getModifierWithDishesById(id: string) {
        return this.modifierModel.findById(id).populate('dishIds')
    }


    async findByIdWithDishes(id: string): Promise<any> {
       return this.modifierModel.findById(id)
            .populate({
                path: 'dishIds',
            })
            .lean(true)
            .exec();
    }


}