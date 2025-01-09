import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Kids } from "./models/kid.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";



@Injectable()
export class KidsRepository extends AbstractRepository<Kids> {
    protected readonly logger = new Logger(KidsRepository.name);

    constructor(
        @InjectModel(Kids.name) private readonly kidModel: Model<Kids>
    ) {
        super(kidModel);
    }

    async getKidsWithParentAndSchoolDetails({
        filter,
        skip,
        limit,
      }): Promise<any> {
        return this.kidModel
          .find(filter)
          .populate({
            path: 'parentId',
            select: 'first_name  email phone',
          })
          .populate({
            path: 'schoolId',
            select: 'first_name last_name schoolName',
          })
          .skip(skip)
          .limit(limit)
          .lean(true)
          .exec();
      }
    
      async getKisDetailsByIdWithParent(id: string) {
        return this.kidModel.findById(id);
      }
    
      async getKidsByParentId(parentId: string) {
    
        // const parentObjectId = new Types.ObjectId(parentId);
        return this.kidModel.find({ parentId });
      }
    
      async getKidSchoolAddressById(id: string) {
        return this.kidModel.findById(id).populate({
          path: 'schoolId',
          select: 'schoolName address',
        });
      }

}