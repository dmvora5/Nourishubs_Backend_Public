import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Orders } from './models/orders.schemas';

@Injectable()
export class OrdersRepository extends AbstractRepository<Orders> {
    protected readonly logger = new Logger(OrdersRepository.name);

    constructor(
        @InjectModel(Orders.name) protected orderModel: Model<Orders>,
        @InjectConnection() connection: Connection,
        // @Inject(CACHE_MANAGER) cacheManager: Cache
    ) {
        super(
            orderModel
        );
    }

    /**
     * Update the `isReviewed` flag of an order.
     * @param orderId - The ID of the order to update.
     * @param isReviewed - The new value for the `isReviewed` flag.
     * @returns The updated order document.
     */
    async updateIsReviewed(
        orderId: string,
        isReviewed: boolean,
    ): Promise<Orders | null> {
        try {
            const updatedOrder = await this.orderModel.findOneAndUpdate(
                { _id: orderId }, // Filter
                { $set: { isReviewed } }, // Update
                { new: true }, // Return the updated document
            );
            if (updatedOrder) {
                this.logger.log(
                    `Order ${orderId} updated with isReviewed=${isReviewed}`,
                );
            } else {
                this.logger.warn(`Order ${orderId} not found for updating isReviewed.`);
            }
            return updatedOrder;
        } catch (error) {
            this.logger.error(
                `Failed to update isReviewed for order ${orderId}`,
                error.stack,
            );
            throw error;
        }
    }

    async getOrdersForKid(kidId: any): Promise<any> {
        try {
            const orders = await this.orderModel
                .find({ kidId })
                .populate('vendorId')
                .exec();

            if (!orders || orders.length === 0) {
                return {
                    status: false,
                    message: 'No orders found for this kid'
                };
            }

            return {
                status: true,
                data: orders,
            };
        } catch (error) {
            return {
                message: 'An error occurred while fetching orders',
                error: error.message,
            };
        }
    }

    async getOrdersForStaff(staffId: any): Promise<any> {
        try {
            const orders = await this.orderModel
                .find({ staffId })
                .populate('vendorId')
                .exec();

            if (!orders || orders.length === 0) {
                return {
                    status: false,
                    message: 'No orders found for this staff'
                };
            }

            return {
                status: true,
                data: orders,
            };
        } catch (error) {
            return {
                message: 'An error occurred while fetching orders',
                error: error.message,
            };
        }
    }
}
