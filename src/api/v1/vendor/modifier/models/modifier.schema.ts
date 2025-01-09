import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, versionKey: false }) // Enables `createdAt` and `updatedAt` fields
export class Modifier extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  vendor: string;

  @Prop()
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'Dish', required: true })
  dishIds: Types.ObjectId[]; // Array of IDs referring to another model

  @Prop({ type: Boolean, default: false }) // Checkbox field with a default value of unchecked
  requireCustomerToSelectDish: boolean;

  @Prop({ enum: ['exactly', 'atleast', 'maximum'] })
  required_rule: string; // e.g., weight, volume, count

  @Prop()
  quantity: number;

  @Prop({ type: Boolean, default: false }) // Checkbox field with a default value of unchecked
  what_the_maximum_amount_of_item_customer_can_select: boolean;

  @Prop()
  max_selection: number;

  @Prop()
  notes: string;

  @Prop({ required: true, enum: ['active', 'deleted'], default: 'active' })
  status: string;
}

export const ModifierSchema = SchemaFactory.createForClass(Modifier);

