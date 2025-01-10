import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NewsLetter } from "./models/newsleter.entity";


@Injectable()
export class NewsLetterRepository extends AbstractRepository<NewsLetter> {
    protected readonly logger = new Logger(NewsLetterRepository.name);

    constructor(
        @InjectModel(NewsLetter.name) protected newsLetterrModel: Model<NewsLetter>,
    ) {
        super(
            newsLetterrModel,
        );
    }
}