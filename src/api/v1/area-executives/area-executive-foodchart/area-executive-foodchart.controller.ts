import { BasicQueryDto, CurrentUser, FOODCHART_TYPE, IUser, LOCATION, PermissionGuard, PERMISSIONS, ROLES, SubPermissionGuard, Validate } from '@app/common';
import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { FoodchartService } from 'src/modules/foodchart/foodchart.service';
import { CreateFoodChartsWithAreaExecutiveDto } from './dtos/area-executive.dtos';
import { ApproveFoodChartDto } from 'src/modules/foodchart/dtos/food-charts-dtos';

@ApiBearerAuth()
@ApiTags("Area-Executive / FoodChart")
@Controller('area-executives-foodchart')
@PermissionGuard({
  permissions: [PERMISSIONS.FOOCHARTMANAGEMENT.permission],
  roles: [ROLES.AREA_EXECUTIVE]
}) export class AreaExecutiveFoodchartController {
  constructor(private readonly foodChartService: FoodchartService) { }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.FOOCHARTMANAGEMENT.subPermissions.GETFOODCHARTREQUESTS]
  })
  @Get()
  @Validate()
  async getFoodChartRequests(
    @CurrentUser() user: IUser,
    @Query() query: BasicQueryDto,
    @I18n() i18n: I18nContext
  ) {
    return this.foodChartService.getFoodChartRequests(
      query,
      user,
      FOODCHART_TYPE.SCHOOL,
      LOCATION.CITY,
      i18n,
    );
  }


  @Post()
  @SubPermissionGuard({
    permissions: [PERMISSIONS.FOOCHARTMANAGEMENT.subPermissions.CREATEFOODCHART]
  })
  async createFoodChart(
    @CurrentUser() user: IUser,
    @Body() payload: CreateFoodChartsWithAreaExecutiveDto,
    @I18n() i18n: I18nContext

  ) {
    return this.foodChartService.createFoodChart(
      {
        schoolAdminId: payload.schoolAdminId,
        areaExecutiveId: user?._id
      },
      {
        details: payload?.details,
        vendors: payload?.vendors
      },
      FOODCHART_TYPE.AREAEXECUTIVE,
      i18n,
      false
    )
  }


  @Get("nearby-vendors")
  @Validate()
  async getNearByVendorList(
    @Query() queryData: BasicQueryDto,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext
  ) {
    return await this.foodChartService.getNearByVendorList(
      queryData,
      user?.location,
      LOCATION.CITY,
      i18n
    );
  }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.FOOCHARTMANAGEMENT.subPermissions.APPROVEFOODCHART]
  })
  @Patch("/approve")
  @Validate()
  async approveFoodChart(
    @CurrentUser() user: IUser,
    @Body() payload: ApproveFoodChartDto,
    @I18n() i18n: I18nContext
  ) {
    return this.foodChartService.approveFoodChart(
      user?._id,
      payload,
      i18n,
      FOODCHART_TYPE.AREAEXECUTIVE
    );
  }


}
