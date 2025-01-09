import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { Issue } from "./models/issueReporting.schemas";





@Injectable()
export class IssueRepotingRepository extends AbstractRepository<Issue> {
    protected readonly logger = new Logger(IssueRepotingRepository.name);

    constructor(
        @InjectModel(Issue.name) protected issueModel: Model<Issue>,
    ) {
        super(
            issueModel,
        );
    }

    async getExistingIssue(query): Promise<any> {
        return this.issueModel
            .findOne(query)
            .exec();
    }

    async countIssues(userId: string): Promise<number> {
        return this.issueModel
            .countDocuments({ userId }) // Filter by the field you need
            .exec();
    }

}