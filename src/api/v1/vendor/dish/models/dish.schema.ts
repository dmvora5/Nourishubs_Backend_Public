import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document, Types, Schema as MongooseSchema } from 'mongoose';



@Schema({ _id: false, versionKey: false })
export class Ingredient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unit: string;

}

@Schema({ timestamps: true, versionKey: false })
export class Dish extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  vendor: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'FoodCategory' })
  categoryIds: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Modifier' })
  modifierIds: mongoose.Schema.Types.ObjectId[];

  @Prop({ required: true })
  pricing: number;

  @Prop({ required: true })
  tax_pricing: number;

  @Prop()
  image: string;

  @Prop({ type: [Ingredient] })
  ingredients: Ingredient[];

  @Prop({ type: Boolean, default: false })
  is_modifier_dish: boolean;

  @Prop({ type: Boolean, default: true })
  is_available: boolean;


  @Prop({ required: true, enum: ['active', 'deleted'], default: 'active' })
  status: string;

}


export const DishSchema = SchemaFactory.createForClass(Dish);