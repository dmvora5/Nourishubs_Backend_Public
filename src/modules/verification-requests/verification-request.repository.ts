import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { VerificationRequests } from "./models/vendorRequest.schemas";



@Injectable()
export class VerificationRequestsRepository extends AbstractRepository<VerificationRequests> {
    protected readonly logger = new Logger(VerificationRequestsRepository.name);

    constructor(
        @InjectModel(VerificationRequests.name) protected verificationRequestModel: Model<VerificationRequests>,
    ) {
        super(
            verificationRequestModel,
        );
    }


}