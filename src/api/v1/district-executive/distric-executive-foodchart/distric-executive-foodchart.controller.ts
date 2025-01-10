import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { BasicQueryDto, CurrentUser, FOODCHART_TYPE, IUser, JwtAuthGuard, LOCATION, PermissionGuard, PERMISSIONS, ROLES, SubPermissionGuard, Validate } from '@app/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FoodchartService } from 'src/modules/foodchart/foodchart.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { CreateFoodChartsWithOrthorityeDto } from '../../area-executives/area-executive-foodchart/dtos/area-executive.dtos';
import { ApproveFoodChartDto } from 'src/modules/foodchart/dtos/food-charts-dtos';

@ApiBearerAuth()
@ApiTags("Distric-Executive / FoodChart")
@Controller('distric-executive-foodchart')
@PermissionGuard({
  permissions: [PERMISSIONS.FOOCHARTMANAGEMENT.permission],
  roles: [ROLES.DISTRICT_EXECUTIVE]
})
@UseGuards(JwtAuthGuard)
export class DistricExecutiveFoodchartController {
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
      FOODCHART_TYPE.AREAEXECUTIVE,
      LOCATION.DISTRICT,
      i18n,
    );
  }

  @Post()
  @SubPermissionGuard({
    permissions: [PERMISSIONS.FOOCHARTMANAGEMENT.subPermissions.CREATEFOODCHART]
  })
  async createFoodChart(
    @CurrentUser() user: IUser,
    @Body() payload: CreateFoodChartsWithOrthorityeDto,
    @I18n() i18n: I18nContext
  ) {
    return this.foodChartService.createFoodChart({
      allIds: {
        schoolAdminId: payload.schoolAdminId,
      },
      payload: {
        details: payload?.details,
        vendors: payload?.vendors
      },
      type: FOODCHART_TYPE.DISTRICTEXECUTIVE,
      i18n: i18n,
      loginUser: user,
      isEditable: false,
      defaultApprove: true,
    })

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
