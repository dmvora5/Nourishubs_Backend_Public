import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Otp } from "./models/otp.schema";






@Injectable()
export class OtpUserRepository extends AbstractRepository<Otp> {
    protected readonly logger = new Logger(OtpUserRepository.name);

    constructor(
        @InjectModel(Otp.name) private readonly otpModel: Model<Otp>
    ) {
        super(otpModel);
    }

}