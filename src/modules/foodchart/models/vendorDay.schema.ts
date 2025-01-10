import { FOODCHART_TYPE } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";






@Schema({ timestamps: true, versionKey: false })
export class VendorDay extends Document {

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" })
    vendorId: string;

    // @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "FoodChart" })
    // foodChartId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "FoodChart" })
    schoolAdminId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    areaExecutiveId: string;

    @Prop({ type: String, required: true }) // Ensure it's stored as a string
    date: string;

    // @Prop({ required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] })
    // dayOfWeek: string;

    // @Prop({ default: false })
    // isRecurring: boolean;

    @Prop({ default: null })
    groupId: string; // A unique identifier for the recurring group

    // @Prop({ enum: ['weekly', 'monthly'], default: 'weekly' })
    // recurrenceType: string;

    // @Prop({ default: 0 }) // For "first", "second", etc.
    // weekOfMonth: number; // If recurrenceType is 'monthly', which week (0 = first, 1 = second, etc.)

    // @Prop({ default: null })
    // endDate: Date; // The last date for recurrence (optional)

    @Prop()
    details: string;

    @Prop({ enum: Object.values(FOODCHART_TYPE) })
    type: string;


    @Prop({
        type: String,
        enum: ['Approved', 'Pending', 'Reject'],
        default: 'Pending',
    })
    isApproved: string;


    @Prop()
    categories: [];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', select: false })
    approvedBy: string
}


export const VendorDaySchema = SchemaFactory.createForClass(VendorDay);