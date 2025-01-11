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
import { BasicQueryDto, CurrentUser, IUser, JwtAuthGuard, LOCATION, PermissionGuard, PERMISSIONS, REQUEST_USER_TYPE, ROLES, SubPermissionGuard, Validate, ValidateObjectIdPipe } from '@app/common';
import { VerificationRequestsService } from 'src/modules/verification-requests/verification-requests.service';
import { OrdersService } from 'src/modules/orders/orders.service';
import { CancleOrderDto } from 'src/modules/orders/dtos/cancle-order.dtos';
import { VendorManagementService } from 'src/modules/vendor-management/vendor-management.service';
import { MealSelectionService } from 'src/modules/meal-selection/meal-selection.service';
import { CreateOrderFromAuthority } from 'src/modules/orders/dtos/create-order-from-authority-dtos';
import { CloseRequestDto } from 'src/modules/verification-requests/dtos/requests.dto';

@ApiBearerAuth()
@ApiTags('Area-Executive / Order-Management')
@Controller('area-executive-order-management')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly vendorManagementService: VendorManagementService,
    private readonly verificationRequestsService: VerificationRequestsService,
    private readonly mealSelectionService: MealSelectionService,
    private readonly orderService: OrdersService,
  ) { }


  @Get('all-cancle-orders')
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  @Validate()
  async getAllCancleOrders(
    @Query() query: BasicQueryDto,
    @I18n() i18n: I18nContext,
    @CurrentUser() user: IUser,
  ) {
    return this.orderService.getAllCancelOrders(
      query,
      i18n,
      LOCATION.CITY,
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
  @Validate()
  async cancleOrderRequest(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() payload: CancleOrderDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.orderService.cancleOrderRequest(id, payload, i18n);
  }

  @Get('nearby-vendors')
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
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
    return await this.vendorManagementService.allApprovedVendors(user, LOCATION.CITY, i18n);
  }

  @Get('get-all-categories')
  @ApiOperation({ summary: 'Get all categories for a selected vendor' })
  @ApiQuery({
    name: 'vendorId',
    required: true,
    type: String,
    description: 'Vendor ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Vendor categories retrieved successfully.',
  })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async getVendorCategories(
    @Query('vendorId') vendorId: string,
    @I18n() i18n: I18nContext,
  ) {
    return await this.mealSelectionService.getVendorCategories(vendorId, i18n);
  }

  @Post('/place-order')
  @ApiQuery({
    name: 'targetedUserId',
    description: 'access users',
    required: false,
  })
  async addToCart(
    @Body() createOrder: CreateOrderFromAuthority,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext,
  ) {

    return await this.orderService.createOrderFromAuthority(createOrder, i18n);

  }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.VERIFICATIONREQUESTS]
  })
  @Get('threshold')
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  @Validate()
  async thresholdtVerificationList(
    @Query() query: BasicQueryDto,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext,
  ) {
    return this.verificationRequestsService.getAllPendingThresHoldVerifications(
      query,
      user,
      LOCATION.CITY,
      i18n,
    );
  }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.VERIFYUSER]
  })
  @Patch('threshold-request/:id')
  @Validate()
  async thresholdRequest(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() payload: CloseRequestDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.verificationRequestsService.closeThresHoldRequest(
      id,
      payload,
      i18n,
    );
  }

}
