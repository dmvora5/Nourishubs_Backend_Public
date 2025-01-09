import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false})
export class Issue extends Document {
  @Prop({ required: true })
  issue_topic: string;

  @Prop({ required: true })
  issue_topic_slug: string;

  @Prop({ required: true })
  date: string;

  @Prop()
  issue_description: string;

  @Prop()
  response?: string;

  @Prop({ enum: ['Pending', 'Resolved'] })
  status: string;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'User', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'Kids'})
  kidId: Types.ObjectId;
}

export const IssueSchema = SchemaFactory.createForClass(Issue);