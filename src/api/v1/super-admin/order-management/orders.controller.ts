import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  BasicQueryDto,
  CurrentUser,
  IUser,
  JwtAuthGuard,
  Validate,
  ValidateObjectIdPipe,
  LOCATION
} from '@app/common';
import { MealSelectionService } from 'src/modules/meal-selection/meal-selection.service';
import { OrdersService } from 'src/modules/orders/orders.service';
import { CancleOrderDto } from 'src/modules/orders/dtos/cancle-order.dtos';
import { VendorManagementService } from 'src/modules/vendor-management/vendor-management.service';
@ApiBearerAuth()
@ApiTags('Super-Admin / Order-Management')
@Controller('super-admin-order-management')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly mealSelectionService: MealSelectionService,
    private readonly parentmealSelectionService: MealSelectionService,
    private readonly vendorManagementService: VendorManagementService,
    private readonly orderService: OrdersService,
  ) { }


  @Get('all-cancle-orders')
  @Validate()
  async getAllCancleOrders(
    @Query() query: BasicQueryDto,
    @I18n() i18n: I18nContext,
    @CurrentUser() user: IUser,
  ) {
    return this.orderService.getAllCancelOrders(
      query,
      i18n,
      LOCATION.ALL,     
      user,
    );
  }

  @Get('get-order/:id')
  @ApiOperation({ summary: 'Get order details by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order details retrieved successfully.',
  })
  async getOrderById(
    @Param('id', ValidateObjectIdPipe) id: string,
    @I18n() i18n: I18nContext,
  ) {
    return this.orderService.getOrderById(id, i18n);
  }

  @Patch('cancle-order-request/:id')
  @ApiOperation({
    summary: 'Accept or reject a last-minute cancel order request',
  })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  @ApiBody({
    type: CancleOrderDto,
    description: 'Payload for cancel order request',
  })
  @ApiResponse({
    status: 200,
    description: 'Cancel order request handled successfully.',
  })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async cancleOrderRequest(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() payload: CancleOrderDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.orderService.cancleOrderRequest(id, payload, i18n);
  }

  @Get('nearby-vendors')
  @ApiOperation({ summary: 'Get a list of nearby vendors' })
  @ApiResponse({
    status: 200,
    description: 'Nearby vendors retrieved successfully.',
  })
  @Validate()
  async getNearByVendorList(
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext,
  ) {
    return await this.vendorManagementService.allApprovedVendors(user,LOCATION.ALL,i18n);
  }

  // @Get('get-all-categories')
  // @ApiOperation({ summary: 'Get all categories for a selected vendor' })
  // @ApiQuery({
  //   name: 'vendorId',
  //   required: true,
  //   type: String,
  //   description: 'Vendor ID',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Vendor categories retrieved successfully.',
  // })
  // @UsePipes(
  //   new ValidationPipe({
  //     transform: true,
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //   }),
  // )
  // async getVendorCategories(
  //   @Query('vendorId') vendorId: string,
  //   @I18n() i18n: I18nContext,
  // ) {
  //   return await this.orderService.getVendorCategories(vendorId, i18n);
  // }

  // @Post('/add-to-cart')
  // @ApiQuery({
  //   name: 'targetedUserId',
  //   description: 'access users',
  //   required: false,
  // })
  // async addToCart(
  //   @Body() createCartDto: StaffCreateCartDto,
  //   @CurrentUser() user: IUser,
  //   @I18n() i18n: I18nContext,
  // ) {
  //   // Check if a cart already exists for this parent and kid
  //   const cart = await this.mealSelectionService.findByStaffId(user?._id);

  //   if (!cart) {
  //     // If no cart exists, create a new one
  //     return await this.mealSelectionService.createCart(createCartDto, i18n);
  //   }
  // }

  // @Post('/update-cart-items/:id')
  // @ApiQuery({
  //   name: 'targetedUserId',
  //   description: 'access users',
  //   required: false,
  // })
  // async updateCartItem(
  //   @Param('id', ValidateObjectIdPipe) id: string,
  //   @Body() newCartItems: StaffCreateCartItemDto,
  //   @I18n() i18n: I18nContext,
  // ) {
  //   const cart = await this.mealSelectionService.findCartById(id);
  //   console.log(newCartItems);
  //   return await this.mealSelectionService.updateCartItems(
  //     cart?._id,
  //     newCartItems,
  //     i18n,
  //   );
  // }

  // @Get('/dish-details')
  // async getDishDetails(
  //   @Query('dishId') dishId: string,
  //   @Query('modifierId') modifierId: string,
  //   @I18n() i18n: I18nContext,
  // ) {
  //   console.log(dishId);
  //   console.log(modifierId);
  //   return await this.parentmealSelectionService.getDishDetails(
  //     dishId,
  //     modifierId,
  //     i18n,
  //   );
  // }
}
