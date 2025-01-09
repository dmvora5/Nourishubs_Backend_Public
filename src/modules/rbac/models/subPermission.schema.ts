import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";




@Schema({ timestamps: true, versionKey: false })
export class SubPermission extends Document {

    @Prop({ required: true })
    _id: string;

    @Prop({ required: true, unique: true })
    name: string;

}



export const SubPermissionSchema = SchemaFactory.createForClass(SubPermission);