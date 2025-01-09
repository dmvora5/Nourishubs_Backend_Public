import { RolesPermission } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";



@Schema({ timestamps: true, versionKey: false })
export class Role extends Document {
    @Prop({ required: true })
    _id: string;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ type: [RolesPermission], default: [] })
    permissions: RolesPermission[];

    @Prop({ type: [{ type: String, ref: "Role" }], default: [] })
    childRoles: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);