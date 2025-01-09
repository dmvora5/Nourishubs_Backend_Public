import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Orders extends Document {
    @Prop({ type: mongoose.Schema.ObjectId, ref: "User", required: true })
    vendorId: Types.ObjectId;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "User", required: false })
    userId: Types.ObjectId;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "Kids", required: false })
    kidId: Types.ObjectId;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "User", required: false })
    schoolId: Types.ObjectId;

    @Prop()
    deliveryAddress: string;

    @Prop({
        type: [
            {
                dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                notes: { type: String }, // Optional special instructions
                modifiers: [
                    {
                        modifierId: { type: mongoose.Schema.Types.ObjectId, ref: "Modifier" },
                        price: { type: Number, required: true },
                        quantity: { type: Number, default: 1 } // Modifier-specific quantity (optional)
                    }
                ]
            }
        ],
        required: true,
    })
    orderItems: {
        dishId: Types.ObjectId;
        quantity: number;
        price: number;
        notes?: string;
        modifiers?: {
            modifierId: Types.ObjectId;
            price: number;
            quantity?: number;
        }[];
    }[]; // Detailed order items with quantities and prices

    @Prop({ type: String, enum: ['pending', 'accepted', 'delivered',"reject", 'cancelled'], default: 'pending' })
    orderStatus: string; // Order status

    @Prop()
    rejectReason: string;// Order status

    @Prop({ type: String, enum: ['pending', 'initiate', 'accepted', 'reject']})
    cancelorderRequestStatus: string; // Order status

    @Prop()
    cancelorderRequestRejectReason: string;// Order status

    @Prop({ type: String })
    orderDate: string; // Delivery date and time

    @Prop({ type: String, required: true })
    deliveryType: string; // Delivery type, e.g., "school" or "home"

    @Prop({ type: String, required: true })
    orderType: string; // Delivery type, e.g., "reguler" or "event"

    @Prop({ type: String, required: false })
    eventName: string; // Delivery type, e.g., "reguler" or "event"

    @Prop({ type: Number, required: true })
    totalAmount: number; // Total order amount

    @Prop({ type: String })
    paymentMethod: string; // Payment method (e.g., "card", "cash")

    @Prop({ type: Boolean, default: false })
    isPaid: boolean; // Payment status

    @Prop({ type: Boolean, default: false })
    isReviewed: boolean; // Review status

    @Prop({ type: String })
    cancelOrderDescription: string; // Additional notes from the parent

    @Prop({ type: Date })
    cancelOrderDate: Date;

    @Prop({ type: String })
    notes: string; // Additional notes from the parent
}

export const OrderSchema = SchemaFactory.createForClass(Orders);