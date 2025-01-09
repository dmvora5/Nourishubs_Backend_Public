import { BasicQueryDto, CurrentUser, IUser, JwtAuthGuard, KidVerificationGuard, Validate } from '@app/common';
import { CommonResponseService } from '@app/common/services';
import { Body, Controller, Get, NotFoundException, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { KidService } from 'src/modules/kids/kid.service';
import { MealSelectionService } from 'src/modules/meal-selection/meal-selection.service';
import { OrdersService } from 'src/modules/orders/orders.service';
import { KidIdDto } from './dtos/parent-orders.dto';

@ApiBearerAuth()
@ApiTags("Parent / Orders")
@Controller('parent-orders')
@UseGuards(JwtAuthGuard)
export class ParentOrdersController {
  constructor(
    private readonly MealSelectionService: MealSelectionService,
    private readonly orderService: OrdersService,
    private readonly responseService: CommonResponseService,
    private readonly kidService: KidService,
  ) { }


  @KidVerificationGuard('kidId')
  @Post('/place-order')
  @Validate()
  async createOrderFromCart(
    @Body() payload: KidIdDto,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext,
  ) {
    const userId = user?._id;

    const cart = await this.MealSelectionService.getCart({
      userId,
      kidId: payload.kidId,
    });
    if (!cart) {
      throw new NotFoundException(i18n.translate('messages.cartNotFound'));
    }

    const orderData = {
      vendorId: cart.vendorId,
      userId: cart.userId,
      kidId: cart.kidId,
      schoolId: cart.schoolId,
      deliveryAddress: cart.deliveryAddress,
      orderItems: cart.cartItems.map((item) => ({
        dishId: item.dishId,
        quantity: item.quantity,
        price: item.price,
        notes: item.notes,
        modifiers: item.modifiers,
      })),
      totalAmount: cart.totalAmount,
      orderDate: cart.orderDate,
      deliveryType: 'school',
      orderType: 'regular',
      isPaid: false,
      paymentMethod: null,
    };

    const order = await this.orderService.createOrder(orderData);

    await this.orderService.clearCart(cart._id);

    return this.responseService.success(
      i18n.translate('messages.orderCreated'),
      order,
    );
  }


  @Get('/traking')
  async getOrderTraking(
    @CurrentUser() user: IUser,
    @Query() query: BasicQueryDto,
    @I18n() i18: I18nContext,
  ) {
    return this.orderService.getOrderTraking(query, i18, user?._id);
  }

  @Get('/complete-order-list')
  async getCompleteOrderList(
    @Query() query: BasicQueryDto,
    @I18n() i18: I18nContext,
    @CurrentUser() user: IUser,
  ) {
    const userId = user?._id;
    return this.orderService.getCompleteOrderList(query, i18, userId);
  }

}
