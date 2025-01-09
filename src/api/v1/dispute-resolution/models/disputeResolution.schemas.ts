import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document, Types} from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class DisputeResolution extends Document {
  @Prop()
  schoolName?: string;

  @Prop()
  orderDetail?: string;

  @Prop()
  address?: string;

  @Prop({ required: true })
  orderDate: string;

  @Prop({ enum: ['Pending', 'Resolved'] })
  status: string;

  @Prop()
  response?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Country',
  })
  countryId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  vendorId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Issue' })
  issueId: Types.ObjectId;
}

export const DisputeSchema = SchemaFactory.createForClass(DisputeResolution);