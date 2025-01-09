import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Country } from "./models/country.schema";




@Injectable()
export class CountryRepository extends AbstractRepository<Country> {
    protected readonly logger = new Logger(CountryRepository.name);

    constructor(
        @InjectModel(Country.name) protected countryModel: Model<Country>,
    ) {
        super(
            countryModel,
        );
    }


   
}