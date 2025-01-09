import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";



@Schema({ timestamps: true, versionKey: false })
export class UserNotification extends Document {
    @Prop({ default: false })
    isViewd: boolean;

    @Prop()
    title: string;

    @Prop()
    reason: string;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "User", required: true })
    user: string;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "Kid"})
    kid: string;

    @Prop({ enum: ["Status"], default: "Status" })
    type: string;
}



export const UserNotificationSchema = SchemaFactory.createForClass(UserNotification);
