import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { VendorDay } from "./models/vendorDay.schema";




@Injectable()
export class VendorDayRepository extends AbstractRepository<VendorDay> {
    protected readonly logger = new Logger(VendorDayRepository.name);

    constructor(
        @InjectModel(VendorDay.name) protected vendorDayModel: Model<VendorDay>,
    ) {
        super(
            vendorDayModel,
        );
    }

    async getFoodChartDataWithVendorsDetails({ filter, startDate, endDate }) {
        return this.vendorDayModel.find({
            ...filter,
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        }).populate({
            path: "vendorId",
            select: "first_name last_name"
        })
    }
}