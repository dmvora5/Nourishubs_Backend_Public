import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { VendorDashbordService } from './vendor-dashbord.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BasicQueryDto, CurrentUser, IUser, JwtAuthGuard, Validate, ValidateObjectIdPipe } from '@app/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { CancleOrderRequestDto } from './dtos/vendor.dashboard.dto';

@ApiBearerAuth()
@ApiTags("Vendor / vendor-orders")
@Controller('vendor-orders')
@UseGuards(JwtAuthGuard)
export class VendorDashbordController {
  constructor(private readonly vendorDashbordService: VendorDashbordService) { }

  @Get('order-data')
  async getVendorOrdersData(@CurrentUser() user: IUser, @I18n() i18: I18nContext) {
    const vendorId = user?._id;

    if (!vendorId) {
      throw new Error('Vendor ID is not available in the request object');
    }

    const [totalOrders, completedOrders, pendingOrders] = await Promise.all([
      this.vendorDashbordService.getOrdersCount(vendorId, i18),
      this.vendorDashbordService.getOrdersCount(vendorId, i18, 'delivered'),
      this.vendorDashbordService.getOrdersCount(vendorId, i18, 'pending'),
    ]);

    return {
      vendorOrderData: {
        totalOrders,
        completedOrders,
        pendingOrders,
      },
    };
  }

  @Get('/pending-order-list')
  @Validate()
  async getPendingOrder(
    @Query() query: BasicQueryDto,
    @I18n() i18: I18nContext,
    @CurrentUser() user: IUser,
  ) {
    const userId = user?._id;
    return this.vendorDashbordService.getPendingOrderList(
      query,
      i18,
      userId,
    );
  }

  @Patch('cancle-order/:id')
  @Validate()
  async cancleOrder(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() payload: CancleOrderRequestDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.vendorDashbordService.cancleOrder(id, payload, i18n);
  }
}
