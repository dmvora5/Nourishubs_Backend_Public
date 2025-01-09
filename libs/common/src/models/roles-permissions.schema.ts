import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false, versionKey: false })
export class RolesPermission {
    @Prop({ type: String, ref: 'Permission', required: true })
    permission: string;

    @Prop({ type: [{ type: String, ref: 'SubPermission' }], required: true })
    subPermissions: string[];
}
