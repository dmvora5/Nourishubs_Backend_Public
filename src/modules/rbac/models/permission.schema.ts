import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema({ timestamps: true, versionKey: false })
export class Permission extends Document {

    @Prop({ require: true })
    _id: string;

    @Prop({ required: true, unique: true })
    name: string;

}


export const PermissionSchema = SchemaFactory.createForClass(Permission);
