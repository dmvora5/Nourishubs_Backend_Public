import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrdersRepository } from './order.repository';
import { BasicQueryDto, getPaginationDetails, ROLES, LOCATION } from '@app/common';
import { I18nContext } from 'nestjs-i18n';
import { CommonResponseService } from '@app/common/services';
import { CartRepository } from '../meal-selection/cart.repository';
import { UserRepository } from 'src/api/v1/users/user.repository';
import { CommonModule } from '../common/common.module';
import { CancleOrderDto } from './dtos/cancle-order.dtos';
import { UserNotificationRepository } from 'src/api/v1/usernotification/usernotification.repository';
import { CreateOrderFromAuthority } from './dtos/create-order-from-authority-dtos';
import { DishRepository } from 'src/api/v1/vendor/dish/dish.repository';
@Injectable()
export class OrdersService {

  constructor(
    private readonly orderRepository: OrdersRepository,
    private readonly cartRepository: CartRepository,
    private readonly userRepository: UserRepository,
    private readonly dishRepository: DishRepository,
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
  async createOrderFromAuthority(createCartDto: CreateOrderFromAuthority, i18n: I18nContext) {
    const order = await this.orderRepository.findById(createCartDto.orderId.toString());
    if (!order) {
      throw new Error(`Order with ID ${createCartDto.orderId} not found`);
    }

    let updatedCartItems = [];
    let totalAmount = 0;
    let baseAmount = 0;

    // await this.kidDashboardService.findAndVerifyKid(parentId?.toString(), kidId?.toString())
    for (const item of createCartDto.cartItems) {
      // Fetch the dish from the database
      const dish = (
        await this.dishRepository.findById(item.dishId?.toString())
      )?.toObject();
      if (!dish) {
        throw new Error(`Dish with ID ${item.dishId} not found`);
      }

      // Calculate the total price for the dish
      let totalPrice = dish.pricing * item.quantity;
      baseAmount = dish.pricing;
      // Process modifiers if they exist
      let updatedModifiers = [];
      if (item.modifiers && item.modifiers.length > 0) {
        for (const modifier of item.modifiers) {
          // Fetch the modifier's associated dish
          const modifierDish = (
            await this.dishRepository.findById(modifier.dishId?.toString())
          )?.toObject();
          if (!modifierDish) {
            throw new Error(
              `Modifier dish with ID ${modifier.dishId} not found`,
            );
          }

          // Calculate modifier price
          const modifierPrice = modifierDish.pricing * item.quantity;
          totalPrice += modifierPrice;
          baseAmount += modifierDish.pricing;
          // Update modifier with calculated price and ensure quantity is set
          const updatedModifier = {
            modifierId: modifier.modifierId,
            dishId: modifier.dishId,
            price: modifierDish.pricing,
            quantity: item.quantity, // Use the same quantity as the item
          };

          updatedModifiers.push(updatedModifier);
        }
      }
      console.log(updatedModifiers);

      // Update cart item with calculated price and updated modifiers
      updatedCartItems.push({
        ...item,
        price: dish.pricing,
        modifiers: updatedModifiers,
      });

      baseAmount = baseAmount;
      totalAmount = totalPrice;
    }

    // Create the new order
    const cart = this.orderRepository.create({
      userId:order?.userId,
      kidId: order?.kidId,
      vendorId:createCartDto.vendorId,
      orderDate:order?.orderDate,
      schoolId: order?.schoolId,
      cartItems: updatedCartItems,
      deliveryAddress:order?.deliveryAddress,
      baseAmount,
      totalAmount, // Assign calculated total amount
    });

    return this.responseService.success(i18n.translate('messages.cartUpdate'), {
      cart,
    });


  }
}
