import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {  OtherUsers, Parent, School, SchoolMembers, User, Vendor } from "./models/user.schema";
import { Model } from "mongoose";



@Injectable()
export class UserRepository extends AbstractRepository<User> {
    protected readonly logger = new Logger(UserRepository.name);

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {
        super(userModel);
    }

    async findUserWithPermissions(id: string) {
        return this.userModel.findById(id, "+approvedKids +allKids")
            .populate({
                path: 'permissions.permission',
                model: 'Permission',
            })
            .populate({
                path: 'permissions.subPermissions',
                model: 'SubPermission',
            })
            .populate({
                path: 'role',
            })
            .lean(true)
            .exec();
    }


}



@Injectable()
export class OtherUserRepository extends AbstractRepository<OtherUsers> {
    protected readonly logger = new Logger(OtherUserRepository.name);

    constructor(
        @InjectModel(OtherUsers.name) private readonly othersUserModel: Model<OtherUsers>
    ) {
        super(othersUserModel);
    }

}


@Injectable()
export class VendorRepository extends AbstractRepository<Vendor> {
    protected readonly logger = new Logger(VendorRepository.name);

    constructor(
        @InjectModel(Vendor.name) private readonly vendorModel: Model<Vendor>
    ) {
        super(vendorModel);
    }

}

@Injectable()
export class SchoolRepository extends AbstractRepository<School> {
    protected readonly logger = new Logger(SchoolRepository.name);

    constructor(
        @InjectModel(School.name) private readonly schoolModel: Model<School>
    ) {
        super(schoolModel);
    }

}

@Injectable()
export class ParentRepository extends AbstractRepository<Parent> {
    protected readonly logger = new Logger(ParentRepository.name);

    constructor(
        @InjectModel(Parent.name) private readonly parentModel: Model<Parent>
    ) {
        super(parentModel);
    }

}


@Injectable()
export class SchoolMembersRepository extends AbstractRepository<SchoolMembers> {
    protected readonly logger = new Logger(SchoolMembersRepository.name);

    constructor(
        @InjectModel(SchoolMembers.name) private readonly schoolMembersModel: Model<SchoolMembers>
    ) {
        super(schoolMembersModel);
    }

}
