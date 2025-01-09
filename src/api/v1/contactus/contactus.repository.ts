import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Contactus } from "./models/contactus.entity";


@Injectable()
export class ContactUsRepository extends AbstractRepository<Contactus> {
    protected readonly logger = new Logger(ContactUsRepository.name);

    constructor(
        @InjectModel(Contactus.name) protected contactUsModel: Model<Contactus>,
    ) {
        super(
            contactUsModel,
        );
    }


    async getContactUsQueryListWithCountryAndPAgination({ filter, skip, limit, orderBy }): Promise<any> {
        return this.contactUsModel
            .find(filter)
            .populate({
                path: 'countryId',
            })
            .skip(skip)
            .limit(limit)
            .sort(orderBy)
            .lean(true)
            .exec();
    }
}