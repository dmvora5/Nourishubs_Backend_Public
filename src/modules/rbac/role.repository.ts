import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { Role } from "./models/role.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class RoleRepository extends AbstractRepository<Role> {
    protected readonly logger = new Logger(RoleRepository.name);

    constructor(
        @InjectModel(Role.name) private readonly roleModel: Model<Role>
    ) {
        super(roleModel);
    }


    async getRoleWithPermissions(id: string) {
        return this.roleModel.findById(id).populate({
            path: 'permissions.permission',
            model: 'Permission',
            select: "-createdAt -updatedAt"
        }).populate({
            path: 'permissions.subPermissions',
            model: 'SubPermission',
            select: "-createdAt -updatedAt"
        }).lean()
    }

}