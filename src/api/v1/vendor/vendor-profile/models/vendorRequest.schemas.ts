import { VENDOR_REQUEST_STATUS, VENDOR_VERIFICATION_TYPE } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


@Schema({ timestamps: true, versionKey: false })
export class VendorRequest extends Document {

    @Prop({ type: mongoose.Schema.ObjectId, ref: "User", required: true })
    vendorId: string;

    @Prop({ required: true, enum: Object.values(VENDOR_VERIFICATION_TYPE) })
    type: string;

    @Prop()
    minThresHold: number;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    documents: Record<string, string>;

    @Prop({ enum: Object.values(VENDOR_REQUEST_STATUS) })
    requestStatus: string;

    @Prop({ default: false})
    approved: boolean;

}

export const VendorRequestSchema = SchemaFactory.createForClass(VendorRequest);