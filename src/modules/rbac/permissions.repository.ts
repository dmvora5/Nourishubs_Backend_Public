import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Permission } from "./models/permission.schema";

@Injectable()
export class PermissionRepository extends AbstractRepository<Permission> {
    protected readonly logger = new Logger(PermissionRepository.name);

    constructor(
        @InjectModel(Permission.name) private readonly permissionsModel: Model<Permission>
    ) {
        super(permissionsModel);
    }

}