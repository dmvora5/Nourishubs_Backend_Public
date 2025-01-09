import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false, versionKey: false })
export class Location {
    @Prop({ required: true })
    latitude: number;

    @Prop({ required: true })
    longitude: number;

    @Prop({
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
    })
    type: string;

    @Prop({
        type: [Number],
        required: true,
        validate: {
            validator: (value: number[]) => value.length === 2,
            message: 'Coordinates must be an array with exactly two elements [longitude, latitude].',
        },
        index: '2dsphere',
    })
    coordinates: number[];

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    district: string;

    @Prop({ required: true })
    country: string;
}
