import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser, IUser, JwtAuthGuard, KidVerificationGuard, PermissionGuard, PERMISSIONS, ROLES, Validate, ValidateObjectIdPipe } from '@app/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AvalebleVendorsForKid } from 'src/modules/meal-selection/dtos/meal-selection.dtos';
import { MealSelectionService } from 'src/modules/meal-selection/meal-selection.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { KidService } from 'src/modules/kids/kid.service';
import { CreateCartForKid } from './dtos/create-cart-kid';
import { CreateCartItemForKid } from './dtos/create-cartItem-forkid';

@ApiBearerAuth()
@ApiTags("Parent / Meal-Selection")
@Controller('parent-meal-selection')
@PermissionGuard({
  permissions: [PERMISSIONS.MEALSELECTION.permission],
  roles: [ROLES.PARENT]
})
@UseGuards(JwtAuthGuard)
export class ParentMealSelectionController {
  constructor(
    private readonly mealSelectionService: MealSelectionService,
    private readonly kidService: KidService
  ) { }


  @KidVerificationGuard('kidId')
  @Validate()
  @Get()
  async getAvalebleVendors(
    @Query() query: AvalebleVendorsForKid,
    @I18n() i18n: I18nContext
  ) {

    const kid = await this.kidService.findKidById(query.kidId);

    return await this.mealSelectionService.getAvalebleVendors(
      {
        startDate: query.startDate,
        endDate: query.endDate,
      },
      kid?.schoolId,
      i18n,
    );
  }



  @KidVerificationGuard('kidId')
  @Get('get-day-wise-menus')
  @Validate()
  async getMenusDayWise(
    @Query() query: AvalebleVendorsForKid,
    @I18n() i18n: I18nContext
  ) {
    const kid = await this.kidService.findKidById(query.kidId);

    return await this.mealSelectionService.getMenusDayWise(
      {
        startDate: query.startDate,
        endDate: query.endDate,
      },
      kid?.schoolId,
      i18n,
    );
  }

  @KidVerificationGuard('kidId')
  @Post('/add-to-cart')
  @Validate()
  async addToCart(@Body() createCartDto: CreateCartForKid, @I18n() i18n: I18nContext) {
    const { userId, kidId } = createCartDto;

    let cart = await this.mealSelectionService.getCart({
      userId,
      kidId
    });

    if (!cart) {
      const kid = await this.kidService.findKidById(kidId);

      return await this.mealSelectionService.createCart(
        createCartDto,
        kidId,
        kid?.schoolId,
        i18n);
    }

  }

  @KidVerificationGuard('kidId')
  @Post('/update-cart-items/:id')
  @Validate()
  async updateCartItem(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() newCartItems: CreateCartItemForKid,
    @I18n() i18n: I18nContext
  ) {
    return await this.mealSelectionService.updateCartItems(id, newCartItems, i18n);
  }


  @KidVerificationGuard('kidId')
  @Get('/cart/:kidId')
  async getCart(
    @Param('kidId', ValidateObjectIdPipe) kidId: string,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext
  ) {

    return this.mealSelectionService.getCart({
      userId: user?._id,
      kidId
    });;
  }


  @Get('/dish-details')
  async getDishDetails(
    @Query('dishId') dishId: string,
    @Query('modifierId') modifierId: string,
    @I18n() i18n: I18nContext
  ) {
    return await this.mealSelectionService.getDishDetails(dishId, modifierId, i18n);
  }


}
