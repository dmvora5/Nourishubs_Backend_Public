import { Location, ROLES, RolesPermission } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Matches } from "class-validator";
import mongoose, { Document } from "mongoose";


export enum DaysOfWeek {
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Sunday = 'Sunday',
}

const timeFormat = /^([01]?[0-9]|2[0-3]):([0-5][0-9])\s?(AM|PM)$/;


@Schema({ timestamps: true })
export class OpeningClosingTime {
    @Prop({ required: true })
    @Matches(timeFormat, { message: 'Opening time must be in a valid format (HH:MM AM/PM)' })
    openingTime: string;

    @Prop({ required: true })
    @Matches(timeFormat, { message: 'Closing time must be in a valid format (HH:MM AM/PM)' })
    closingTime: string;
}

export const OpeningClosingTimeSchema = SchemaFactory.createForClass(OpeningClosingTime);

@Schema({ _id: false, versionKey: false })
export class Venue {
    @Prop({ required: true })
    address: string;

    @Prop({ type: Map, of: OpeningClosingTimeSchema, required: true })
    openingTimes: Map<DaysOfWeek, OpeningClosingTime>;
}



@Schema({ timestamps: true, versionKey: false, discriminatorKey: "kind" })
export class User extends Document {

    @Prop({ required: true })
    first_name: string;

    @Prop({ required: true })
    last_name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    phoneNo: string;

    @Prop({ select: false })
    password: string;

    @Prop({ type: String, ref: 'Role', enum: [...Object.values(ROLES)] })
    role: string;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "User" })
    createdBy: string;

    @Prop({ type: [RolesPermission], required: true })
    permissions: RolesPermission[];

    @Prop({ required: true, enum: ['active', 'suspended', 'deleted'], default: 'active' })
    status: string;

    @Prop({ type: Location, required: false })
    location: Location;

    @Prop()
    profileImage: string;

    @Prop({ default: false })
    isEmailVerified: boolean;
}


export const UserSchema = SchemaFactory.createForClass(User);

@Schema({ timestamps: true, versionKey: false })
export class OtherUsers extends User {

    @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending', required: false })
    verificationStatus?: string | null;
}

export const OtherUsersSchema = SchemaFactory.createForClass(OtherUsers);


//vendor schema
@Schema({ timestamps: true, versionKey: false })
export class Vendor extends OtherUsers {

    @Prop({ required: true })
    companyName: string;

    @Prop()
    description: string;

    @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
    thresHoldApprove: string;

    @Prop()
    minThresHold: number;

    @Prop({ default: 0 })
    numberOfVenue: number;

    @Prop({ type: [Venue] })
    venues: Venue[];

    @Prop({ type: Map, of: String, default: new Map() })
    documents: Map<string, string>;

}

export const VendorSchema = SchemaFactory.createForClass(Vendor);


@Schema({ timestamps: true, versionKey: false })
export class School extends OtherUsers {

    @Prop({ required: true })
    schoolName: string;

    @Prop()
    expectedDeliveryTime: string;

    @Prop()
    age: number;

    @Prop()
    gender: string;

    @Prop({ type: Map, of: String, default: new Map() })
    documents: Map<string, string>;

}

export const SchoolSchema = SchemaFactory.createForClass(School);


@Schema({ timestamps: true, versionKey: false })
export class SchoolMembers extends OtherUsers {

    @Prop({ type: mongoose.Schema.ObjectId, ref: "User", required: true })
    schoolId: string;

}

export const SchoolMembersSchema = SchemaFactory.createForClass(SchoolMembers);

@Schema({ timestamps: true, versionKey: false })
export class Parent extends User {

    @Prop()
    age: number;

    @Prop()
    gender: string;

    @Prop([{ type: mongoose.Schema.ObjectId, ref: "Kid", default: [], select: false }])
    approvedKids: string[];

}

export const ParentSchema = SchemaFactory.createForClass(Parent);






VendorSchema.pre('save', function (next) {
    this.numberOfVenue = this.venues?.length || 0;
    next();
});