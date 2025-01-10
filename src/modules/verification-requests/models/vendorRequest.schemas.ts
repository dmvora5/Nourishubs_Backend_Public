import { REQUEST_STATUS, REQUEST_USER_TYPE, VERIFICATION_TYPE, } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


@Schema({ timestamps: true, versionKey: false })
export class VerificationRequests extends Document {

    @Prop({ type: mongoose.Schema.ObjectId, ref: "User", required: true })
    userId: string;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "User", required: true })
    schoolId: string;

    @Prop({ required: true, enum: Object.values(VERIFICATION_TYPE) })
    type: string;

    @Prop({ enum: Object.values(REQUEST_USER_TYPE) })
    userType: string;

    @Prop()
    minThresHold: number;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    documents: Record<string, string>;

    @Prop({ enum: Object.values(REQUEST_STATUS) })
    requestStatus: string;

    @Prop({ default: false })
    approved: boolean;

}

export const VerificationRequestsSchema = SchemaFactory.createForClass(VerificationRequests);