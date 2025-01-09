import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true, versionKey: false })
export class Country extends Document {

  @Prop()
  name: string;

  @Prop()
  code: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);