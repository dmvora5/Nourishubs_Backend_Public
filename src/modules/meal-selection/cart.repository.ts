import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import {  InjectModel } from "@nestjs/mongoose";
import {  Model } from "mongoose";
import { Cart } from "./models/cart.schemas";




@Injectable()
export class CartRepository extends AbstractRepository<Cart> {
    protected readonly logger = new Logger(CartRepository.name);

    constructor(
        @InjectModel(Cart.name) protected cartModel: Model<Cart>,
    ) {
        super(
            cartModel,
        );
    }

    async getCart(filter: object): Promise<any> {
        return this.cartModel.findOne(filter).populate({
            path: 'cartItems',
            populate: {
                path: 'dishId', // Example for a nested reference in the `Dish` schema
            },
        }).lean(true).exec()
    }


}