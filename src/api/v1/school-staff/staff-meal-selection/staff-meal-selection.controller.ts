import { CurrentUser, IUser, JwtAuthGuard, PermissionGuard, PERMISSIONS, ROLES, Validate, ValidateObjectIdPipe } from '@app/common';
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { CreateCartItemDto } from 'src/modules/meal-selection/dtos/create-cart-item.dtos';
import { CreateCartDto } from 'src/modules/meal-selection/dtos/create-cart.dtos';
import { AvalebleVendors } from 'src/modules/meal-selection/dtos/meal-selection.dtos';
import { MealSelectionService } from 'src/modules/meal-selection/meal-selection.service';

@ApiBearerAuth()
@ApiTags("Staff / Meal-Selection")
@Controller('staff-meal-selection')
@PermissionGuard({
  permissions: [PERMISSIONS.MEALSELECTION.permission],
  roles: [ROLES.TEACHER, ROLES.SCHOOLOTHERS]
})
@UseGuards(JwtAuthGuard)
export class StaffMealSelectionController {
  constructor(private readonly mealSelectionService: MealSelectionService) { }

  @Get()
  @Validate()
  async getAvalebleVendors(
    @CurrentUser() user: IUser,
    @Query() query: AvalebleVendors,
    @I18n() i18n: I18nContext
  ) {
    return await this.mealSelectionService.getAvalebleVendors(query, user?.schoolId, i18n);
  }


  @Get('get-day-wise-menus')
  @Validate()
  async getMenusDayWise(
    @CurrentUser() user: IUser,
    @Query() query: AvalebleVendors,
    @I18n() i18n: I18nContext
  ) {
    return await this.mealSelectionService.getMenusDayWise(query, user?.schoolId, i18n);
  }


  @Get('get-all-categories')
  @Validate()
  async getVendorCategories(
    @Query('vendorId') vendorId: string,
    @I18n() i18n: I18nContext
  ) {

    return await this.mealSelectionService.getVendorCategories(vendorId, i18n);
  }


  @Post('/add-to-cart')
  @Validate()
  async addToCart(
    @Body() createCartDto: CreateCartDto,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext
  ) {

    let cart = await this.mealSelectionService.getCart({ userId: user?._id });

    if (!cart) {
      return await this.mealSelectionService.createCart(createCartDto, user?.schoolId, null, i18n);
    }
  }


  @Post('/update-cart-items/:id')
  @Validate()
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  async updateCartItem(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() newCartItems: CreateCartItemDto,
    @I18n() i18n: I18nContext
  ) {
    return await this.mealSelectionService.updateCartItems(id, newCartItems, i18n);
  }


  @Get('/dish-details')
  async getDishDetails(@Query('dishId') dishId: string, @Query('modifierId') modifierId: string, @I18n() i18n: I18nContext) {
    console.log(dishId);
    console.log(modifierId);
    return await this.mealSelectionService.getDishDetails(dishId, modifierId, i18n);
  }

}
