import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true, versionKey: false })
export class NewsLetter extends Document {

    @Prop({ required: true })
    email: string;

    @Prop()
    isSubscribed: boolean;
}


export const NewsLetterSchema = SchemaFactory.createForClass(NewsLetter);