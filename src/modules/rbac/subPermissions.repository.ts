import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Permission } from "./models/permission.schema";
import { SubPermission } from "./models/subPermission.schema";

@Injectable()
export class SubPermissionRepository extends AbstractRepository<SubPermission> {
    protected readonly logger = new Logger(SubPermissionRepository.name);

    constructor(
        @InjectModel(SubPermission.name) private readonly subPermissionsModel: Model<SubPermission>
    ) {
        super(subPermissionsModel);
    }

}