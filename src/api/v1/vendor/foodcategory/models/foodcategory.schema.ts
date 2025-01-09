import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


@Schema({ timestamps: true, versionKey: false }) // Enables `createdAt` and `updatedAt` fields
export class FoodCategory extends Document {
    @Prop()
    name: string;

    @Prop()
    imageUrl: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    vendor: string;

    @Prop({ required: true, enum: ['active', 'deleted'], default: 'active' })
    status: string;
}


export const FoodCategorySchema = SchemaFactory.createForClass(FoodCategory);

FoodCategorySchema.virtual('dishes', {
    ref: 'Dish', // Name of the model to reference
    localField: '_id', // Field in `FoodCategory` to match
    foreignField: 'categoryIds', // Field in `Dish` model to match
});

// Enable virtuals in the JSON output
FoodCategorySchema.set('toJSON', { virtuals: true });
FoodCategorySchema.set('toObject', { virtuals: true });



