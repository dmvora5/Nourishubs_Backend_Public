import { Injectable,NotFoundException, BadRequestException } from '@nestjs/common';
import { OrdersRepository } from './order.repository';
import { BasicQueryDto, getPaginationDetails, ROLES, LOCATION } from '@app/common';
import { I18nContext } from 'nestjs-i18n';
import { CommonResponseService } from '@app/common/services';
import { CartRepository } from '../meal-selection/cart.repository';
import { UserRepository } from 'src/api/v1/users/user.repository';
import { CommonModule } from '../common/common.module';
import { CancleOrderDto } from './dtos/cancle-order.dtos';
import { UserNotificationRepository } from 'src/api/v1/usernotification/usernotification.repository';
@Injectable()
export class OrdersService {

  constructor(
    private readonly orderRepository: OrdersRepository,
    private readonly cartRepository: CartRepository,
    private readonly userRepository: UserRepository,
    private readonly responseService: CommonResponseService,
    private readonly userNotificationRepository: UserNotificationRepository,

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

  async getAllCancelOrders(
    query: BasicQueryDto,
    i18n: I18nContext,
    location: string,
    user: any,
  ) {
    const { page, limit, searchQuery, orderBy = { createdAt: -1 } } = query;

    const skip = page && limit ? (page - 1) * limit : 0;
    const commanFilter: any = { role: ROLES.VENDOR };

    let locationSearch = {};
    if (location) {
      switch (location) {
        case LOCATION.COUNTRY:
          locationSearch = {
            'location.country': {
              $regex: `^${user.location.district.trim()}$`,
              $options: 'i',
            },
          };
          break;
        case LOCATION.STATE:
          locationSearch = {
            'location.state': {
              $regex: `^${user.location.district.trim()}$`,
              $options: 'i',
            },
          };
          break;
        case LOCATION.DISTRICT:
          locationSearch = {
            'location.district': {
              $regex: `^${user.location.district.trim()}$`,
              $options: 'i',
            },
          };
          break;
        case LOCATION.CITY:
          locationSearch = {
            'location.city': {
              $regex: `^${user.location.district.trim()}$`,
              $options: 'i',
            },
          };
          break;
        default:
          break;
      }
    }

    const finalFilter = {
      ...commanFilter,
      ...locationSearch,
    };

    const vendors = await this.userRepository.find(finalFilter);
    if (!vendors || vendors.length === 0) {
      throw new Error(await i18n.translate('messages.vendorsNotFound'));
    }

    const vendorIds = vendors.map((vendor: any) => vendor._id);

    const filter: any = {
      vendorId: { $in: vendorIds },
      cancelorderRequestStatus: 'initiate',
    };
    const allOrdersList = await this.orderRepository.findWithPagination(
      filter,
      { skip, limit, orderBy },
      {},
      [
        { path: 'vendorId', select: 'first_name last_name address' }, // Populate vendor details
        { path: 'schoolId', select: 'schoolName address' }, // Populate school details
      ] // Pass the populate options
    );
    
    const totalFiltered = await this.orderRepository.countDocuments(filter);
    const total = await this.orderRepository.countDocuments(filter);
    const { totalPage, startIndex, endIndex, currentPageFilteredCount } =
      getPaginationDetails({
        data: allOrdersList,
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

    const resData = {
      data: allOrdersList,
    };

    return this.responseService.success(
      await i18n.translate('messages.usersRetrieved'),
      resData,
      meta,
    );
  }

  async getOrderById(id: string, i18n: I18nContext) {
    const vendor = await this.orderRepository.findById(id, 'vendorId');

    if (!vendor) {
      throw new NotFoundException(
        await i18n.translate('messages.orderNotFound'),
      );
    }

    return this.responseService.success(
      await i18n.translate('messages.orderRetrieved'),
      vendor,
    );
  }

  async cancleOrderRequest(
    reqId: string,
    payload: CancleOrderDto,
    i18n: I18nContext,
  ) {
    const request = await this.orderRepository.findById(reqId);

    if (!request) {
      throw new NotFoundException(
        await i18n.translate('messages.requestNotFound'),
      );
    }

    if (request.cancelorderRequestStatus !== 'initiate') {
      throw new BadRequestException(
        await i18n.translate('messages.requestAlreadyClose'),
      );
    }

    request.cancelorderRequestRejectReason =
      payload.cancelorderRequestRejectReason;
    request.cancelorderRequestStatus = payload.isCancelRequestApproved ? 'accepted' : 'reject';

    await request.save();

 

    await this.userNotificationRepository.create({
      userId: request.vendorId,
      title: payload.isCancelRequestApproved ? 'your order cancel request approved' : 'your order cancel request rejected',
      ...payload,
  });
    return this.responseService.success(
      await i18n.translate('messages.requestClose'),
      null,
    );
  }
}
