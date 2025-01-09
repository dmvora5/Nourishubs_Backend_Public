import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { VendorRequest } from "./models/vendorRequest.schemas";
import { Connection, Model } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";



@Injectable()
export class VendorRequestsRepository extends AbstractRepository<VendorRequest> {
    protected readonly logger = new Logger(VendorRequestsRepository.name);

    constructor(
        @InjectModel(VendorRequest.name) protected vendorRequestModel: Model<VendorRequest>,
    ) {
        super(
            vendorRequestModel,
        );
    }


}