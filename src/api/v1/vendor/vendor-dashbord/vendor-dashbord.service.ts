import { BasicQueryDto, getPaginationDetails } from '@app/common';
import { CommonResponseService } from '@app/common/services';
import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { OrdersRepository } from 'src/modules/orders/order.repository';
import { CancleOrderRequestDto } from './dtos/vendor.dashboard.dto';

@Injectable()
export class VendorDashbordService {

    constructor(
        private readonly responseService: CommonResponseService,
        private readonly orderRepository: OrdersRepository
    ) { }



    async getOrdersCount(
        vendorId: string,
        i18n: I18nContext,
        orderStatus?: string,
    ) {
        const query: any = { vendorId };
        if (orderStatus) {
            query.orderStatus = orderStatus;
        }
        // return this.orderModel.countDocuments(query);
        return this.responseService.success(
            await i18n.translate('messages.mealReviewFetch'),
            query,
            null,
        );
    }

    async getPendingOrderList(
        query: BasicQueryDto,
        i18n: I18nContext,
        userId: string,
    ) {

        const { page = 1, limit = 10, searchQuery, orderBy = { createdAt: -1 } } = query;

        const skip = (page - 1) * limit;

        const filter: any = {
            orderStatus: { $nin: ['cancelled'] },
            vendorId: userId,
        };

        if (searchQuery) {
            filter.$or = [
                // { deliveryDate: { $regex: searchQuery, $options: 'i' } },
                // { message: { $regex: searchQuery, $options: 'i' } },
                // { first_name: { $regex: searchQuery, $options: 'i' } },
                // { last_name: { $regex: searchQuery, $options: 'i' } },
            ];
        }

        const [pendingOrdersList, total, totalFiltered] = await Promise.all([
            this.orderRepository.findWithPagination(filter, { skip, limit, orderBy }),
            this.orderRepository.countDocuments({}),
            this.orderRepository.countDocuments(filter),
        ]);

        const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
            getPaginationDetails({
                data: pendingOrdersList,
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
        console.log('i18n.translatei18n.translatei18n.translate', i18n.translate);

        return this.responseService.success(
            await i18n.translate('messages.mealReviewFetch'),
            pendingOrdersList,
            meta,
        );
    }

    async cancleOrder(
        reqId: string,
        payload: CancleOrderRequestDto,
        i18n: I18nContext,
    ) {
        const request = await this.orderRepository.findById(reqId);

        if (!request) {
            throw new NotFoundException(
                await i18n.translate('messages.requestNotFound'),
            );
        }

        // if (request.cancelorderRequestStatus !== 'initiate') {
        //     throw new BadRequestException(
        //         await i18n.translate('messages.requestAlreadyClose'),
        //     );
        // }

        request.cancelorderRequestStatus = 'initiate';
        request.orderStatus = "cancelled";
        request.cancelOrderDescription = payload.cancelOrderDescription,
            request.cancelOrderDate = new Date(),

            await request.save();

        return this.responseService.success(
            await i18n.translate('messages.requestClose'),
            null,
        );
    }
}
