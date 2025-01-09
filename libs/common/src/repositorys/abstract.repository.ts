import { Logger } from "@nestjs/common";
import { Document, FilterQuery, Model, ProjectionType, SaveOptions, UpdateQuery } from "mongoose";


class PaginationDetails {
    skip: number;
    limit: number;
    orderBy?: any = { createdAt: -1 }
}


export abstract class AbstractRepository<TDocument extends Document> {
    protected abstract readonly logger: Logger;


    constructor(protected readonly model: Model<TDocument>) { }

    async create<P>(
        document: P,
        options?: SaveOptions,
    ): Promise<TDocument> {
        const createdDocument = new this.model(document);
        await createdDocument.save(options);

        return createdDocument.toJSON() as unknown as TDocument;
    }

    async findOne(filterQuery: FilterQuery<TDocument>, projection: ProjectionType<TDocument> = {}): Promise<TDocument> {
        return this.model.findOne(filterQuery, projection);
    }

    async findById(_id: string, projection: ProjectionType<TDocument> = {}): Promise<TDocument> {
        return this.model.findById(_id, projection);
    }

    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
    ) {
        return this.model.findOneAndUpdate(filterQuery, update, {
            lean: true,
            new: true,
        });

    }

    async upsert(
        filterQuery: FilterQuery<TDocument>,
        document: Partial<TDocument>,
    ) {
        return this.model.findOneAndUpdate(filterQuery, document, {
            lean: true,
            upsert: true,
            new: true,
        });

    }

    async find(filterQuery: FilterQuery<TDocument>, projection: ProjectionType<TDocument> = {}) {
        return this.model.find(filterQuery, projection, { lean: true });
    }

    async findWithPagination(filterQuery: FilterQuery<TDocument>, metadata: PaginationDetails, projection: ProjectionType<TDocument> = {}) {
        return this.model.find(filterQuery, projection)
            .skip(metadata.skip)
            .limit(metadata.limit)
            .sort(metadata.orderBy)
            .lean(true)
            .exec();
    }

    async countDocuments(filterQuery: FilterQuery<TDocument>) {
        return this.model.countDocuments(filterQuery).exec();
    }

    async insertMany(records: any[]) {
        return this.model.insertMany(records);
    }

    async updateMany(filterQuery: FilterQuery<TDocument>, payload: any) {
        return this.model.updateMany(filterQuery, payload);
    }


    async findByIdAndDelete(id: string) {
        return this.model.findByIdAndDelete(id);
    }


    async aggregate(pipeline: any[]): Promise<any> {
        return this.model.aggregate(pipeline);
    }

    async bulkWrite(data: any[]) {
        return this.model.bulkWrite(data);
    }

    async deleteMany(filter: FilterQuery<TDocument>) {
        return this.model.deleteMany(filter);
    }

    async findByIdAndUpdate(id: string, payload: any) {
        return this.model.findByIdAndUpdate(id, payload);
    }

}