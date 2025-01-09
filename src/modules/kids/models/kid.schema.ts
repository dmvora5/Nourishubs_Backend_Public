import { Location } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ timestamps: true, versionKey: false })
export class Kids extends Document {

    @Prop({ required: true })
    first_name: string;

    @Prop({ required: true })
    last_name: string;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "User", required: true })
    schoolId: string;

    @Prop()
    class: string;

    @Prop()
    age: number;

    @Prop()
    gender: string;

    @Prop()
    grade: string;

    @Prop()
    height: string;

    @Prop()
    weight: string;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "User", required: true })
    parentId: string;

    @Prop()
    imageUrl: string;

    @Prop()
    allergiesOrDietaryDescription: string;

    @Prop({ type: Location, required: false })
    location: Location;

    @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending', required: false })
    verificationStatus?: string;

    @Prop()
    rejectReason: string;// Order status

}


export const KidSchema = SchemaFactory.createForClass(Kids);
