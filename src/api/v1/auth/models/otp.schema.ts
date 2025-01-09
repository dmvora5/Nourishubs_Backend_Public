import { OTP_EXPIRATION_IN_SECONDS } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";



@Schema({ timestamps: true })
export class Otp extends Document {

    @Prop({ required: true })
    email: string;

    @Prop()
    otp: number;

    @Prop({
        type: Date,
        default: Date.now,
        expires: OTP_EXPIRATION_IN_SECONDS
    })
    expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);