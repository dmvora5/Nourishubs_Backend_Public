import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document } from 'mongoose';


@Schema({ timestamps: true, versionKey: false })
export class Contactus extends Document {
    @Prop({ required: true })
    first_name: string;

    @Prop({ required: true })
    last_name: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    phoneNo: string;

    @Prop()
    message: string;

    @Prop()
    role: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Country" })
    countryId: string;
}


export const ContactusSchema = SchemaFactory.createForClass(Contactus);