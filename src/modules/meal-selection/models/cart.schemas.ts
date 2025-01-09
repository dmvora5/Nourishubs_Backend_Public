import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";

@Schema({ timestamps: true, versionKey: false }) // Enables `createdAt` and `updatedAt`
export class Cart extends Document {
    @Prop({ type: mongoose.Schema.ObjectId, ref: "User", required: false })
    vendorId: Types.ObjectId;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "User", required: false })
    userId: Types.ObjectId; // Parent associated with the cart

    @Prop({ type: mongoose.Schema.ObjectId, ref: "Kids", required: false, default: null })
    kidId: Types.ObjectId; // Kid associated with the cart

    @Prop({ type: mongoose.Schema.ObjectId, ref: "User", required: true })
    schoolId: Types.ObjectId;

    @Prop({ type: String })
    deliveryAddress: string; // Delivery address (school)

    @Prop({
        type: [
            {
                dishId: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                notes: { type: String }, // Optional special instructions for the dish
                modifiers: [
                    {
                        modifierId: { type: mongoose.Schema.Types.ObjectId, ref: "Modifier" },
                        dishId: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
                        price: { type: Number, required: true },
                        quantity: { type: Number, default: 1 } // Modifier-specific quantity (optional)
                    }
                ]
            },
        ],
        required: true,
    })
    cartItems: {
        dishId: Types.ObjectId;
        quantity: number;
        price: number;
        notes?: string;
        modifiers?: {
            modifierId: Types.ObjectId;
            dishId: Types.ObjectId;
            price: number;
            quantity?: number;
        }[];
    }[]; // Items in the cart

    @Prop({ type: Number, required: true, default: 0 })
    baseAmount: number; // Total price of all items in the cart

    @Prop({ type: Number, required: true, default: 0 })
    totalAmount: number; // Total price of all items in the cart

    @Prop({ type: String })
    notes: string; // Additional notes for the cart

    @Prop({ type: String })
    orderDate: string; // Delivery date and time

    @Prop({ type: Boolean, default: false })
    isCheckedOut: boolean; // Indicates whether the cart has been finalized into an order

    @Prop({ type: String, required: false })
    eventName: string; // Delivery type, e.g., "reguler" or "event"
}

export const CartSchema = SchemaFactory.createForClass(Cart);
