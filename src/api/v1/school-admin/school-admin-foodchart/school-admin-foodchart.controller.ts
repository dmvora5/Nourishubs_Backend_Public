import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryDto, CurrentUser, FOODCHART_TYPE, IUser, JwtAuthGuard, LOCATION, PermissionGuard, PERMISSIONS, ROLES, SubPermissionGuard, Validate } from '@app/common';
import { FoodchartService } from 'src/modules/foodchart/foodchart.service';
import { AvailbleVendor, CreateFoodChartsDto } from 'src/modules/foodchart/dtos/food-charts-dtos';
import { I18n, I18nContext } from 'nestjs-i18n';

@ApiBearerAuth()
@ApiTags("SchoolAdmin / FoodChart")
@Controller('school-admin-food-chart')
@PermissionGuard({
  permissions: [PERMISSIONS.FOOCHARTMANAGEMENT.permission],
  roles: [ROLES.SCHOOL]
})
@UseGuards(JwtAuthGuard)
export class SchoolAdminFoodchartController {
  constructor(private readonly foodChartService: FoodchartService) { }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.FOOCHARTMANAGEMENT.subPermissions.CREATEFOODCHART]
  })
  @Post()
  @Validate()
  async createFoodChart(
    @CurrentUser() user: IUser,
    @Body() payload: CreateFoodChartsDto,
    @I18n() i18n: I18nContext
  ) {

    return this.foodChartService.createFoodChart({
      allIds: {
        schoolAdminId: user?._id,
      },
      payload,
      type: FOODCHART_TYPE.SCHOOL,
      i18n: i18n,
      loginUser: user,
      isEditable: true,
      defaultApprove: false,
    })
  }


  @Get('get-foodchart-data')
  @Validate()
  async getReoccuringFood(
    @CurrentUser() user: IUser,
    @Query() query: AvailbleVendor,
    @I18n() i18n: I18nContext
  ) {
    return await this.foodChartService.getFoodChartData(
      { schoolAdminId: user?._id, type: FOODCHART_TYPE.SCHOOL },
      query,
      i18n
    );
  }


  @Get("nearby-vendors")
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
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

}
