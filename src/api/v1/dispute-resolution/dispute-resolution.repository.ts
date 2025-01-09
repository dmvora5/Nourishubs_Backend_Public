import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Connection, Model } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { DisputeResolution } from "./models/disputeResolution.schemas";




@Injectable()
export class DisputeResolutionRepository extends AbstractRepository<DisputeResolution> {
    protected readonly logger = new Logger(DisputeResolutionRepository.name);

    constructor(
        @InjectModel(DisputeResolution.name) protected disputesModel: Model<DisputeResolution>,
    ) {
        super(
            disputesModel,
        );

    }

    async findOneDispute(orderDate : string , vendorId: string) {
        return this.disputesModel
        .findOne({ date: orderDate, vendorId: vendorId })
        .exec();
    }
}