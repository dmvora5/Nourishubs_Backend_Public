import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './order.repository';
import { BasicQueryDto, getPaginationDetails } from '@app/common';
import { I18nContext } from 'nestjs-i18n';
import { CommonResponseService } from '@app/common/services';
import { CartRepository } from '../meal-selection/cart.repository';

@Injectable()
export class OrdersService {

    constructor(
        private readonly orderRepository: OrdersRepository,
        private readonly cartRepository: CartRepository,
        private readonly responseService: CommonResponseService,
    ) { }


    async clearCart(cartId: string) {
        return await this.cartRepository.findByIdAndDelete(cartId);
    }

    async createOrder(orderData: any) {
        return this.orderRepository.create(orderData);
    }


    async getOrderTraking(
        query: BasicQueryDto,
        i18n: I18nContext,
        userId: string
    ) {

        const { page = 1, limit = 10, searchQuery, orderBy = { createdAt: -1 } } = query;


        const skip = (page - 1) * limit;

        const filter: any = { userId }


        if (searchQuery) {
            filter.$or = [
                { orderDate: { $regex: searchQuery, $options: 'i' } },
                // { message: { $regex: searchQuery, $options: 'i' } },
                // { first_name: { $regex: searchQuery, $options: 'i' } },
                // { last_name: { $regex: searchQuery, $options: 'i' } },
            ];
        }


        const [orderTrekingList, total, totalFiltered] = await Promise.all([
            this.orderRepository.findWithPagination(filter, { skip, limit, orderBy }),
            this.orderRepository.countDocuments({}),
            this.orderRepository.countDocuments(filter),
        ]);

        const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
            getPaginationDetails({
                data: orderTrekingList,
                count: totalFiltered,
                limit,
                skip,
            });

        const meta = {
            totalFiltered,
            total,
            currentPage: page,
            perPage: limit,
            totalPage,
            startIndex,
            endIndex,
            currentPageFilteredCount,
            searchQuery,
        };
        return this.responseService.success(
            await i18n.translate('messages.orderFetch'),
            { orderTrekingList },
            meta,
        );
    }


    async getCompleteOrderList(
        query: BasicQueryDto,
        i18n: I18nContext,
        userId: string,
      ) {
        const {
          page = 1,
          limit = 10,
          searchQuery,
          orderBy = { createdAt: -1 },
        } = query;
    
        const skip = (page - 1) * limit;
    
        // Calculate the date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
        const filter: any = {
          orderStatus: { $nin: ['delivered'] },
          vendorId: userId,
          createdAt: { $gte: sevenDaysAgo },
        };
    
        if (searchQuery) {
          filter.$or = [
            // Add your search conditions here
            // { deliveryDate: { $regex: searchQuery, $options: 'i' } },
            // { message: { $regex: searchQuery, $options: 'i' } },
            // { first_name: { $regex: searchQuery, $options: 'i' } },
            // { last_name: { $regex: searchQuery, $options: 'i' } },
          ];
        }
    
        const [completeOrdersList, total, totalFiltered] = await Promise.all([
          this.orderRepository.findWithPagination(filter, { skip, limit, orderBy }),
          this.orderRepository.countDocuments({}),
          this.orderRepository.countDocuments(filter),
        ]);
    
        const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
          getPaginationDetails({
            data: completeOrdersList,
            count: totalFiltered,
            limit,
            skip,
          });
    
        const meta = {
          totalFiltered,
          total,
          currentPage: page,
          perPage: limit,
          totalPage,
          startIndex,
          endIndex,
          currentPageFilteredCount,
          searchQuery,
        };
    
        return this.responseService.success(
          await i18n.translate('messages.mealReviewFetch'),
          completeOrdersList,
          meta,
        );
      }

}
