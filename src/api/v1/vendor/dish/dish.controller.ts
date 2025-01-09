import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { DishService } from './dish.service';
import { BasicQueryDto, CurrentUser, IUser, JwtAuthGuard, PermissionGuard, PERMISSIONS, ROLES, SubPermissionGuard, Validate, ValidateObjectIdPipe } from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DishDto } from './dtos/dish.dtos';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UpdateDishDto } from './dtos/update-dish.dtos';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Vendor / Dish')
@Controller('dish')
@PermissionGuard({
  permissions: [PERMISSIONS.MENUMANAGEMENT.permission],
  roles: [ROLES.VENDOR]
})
@UseGuards(JwtAuthGuard)
export class DishController {
  constructor(private readonly dishService: DishService) { }


  //create dish
  @SubPermissionGuard({
    permissions: [PERMISSIONS.MENUMANAGEMENT.subPermissions.CREATEDISH]
  })
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dish creation payload including an optional image file',
    type: DishDto,
  })
  @Validate()
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  @UseInterceptors(FileInterceptor('file'))
  async createDish(@CurrentUser() user: IUser, @Body() payload: DishDto, @UploadedFile() file: Express.Multer.File, @I18n() i18n: I18nContext) {
    console.log(payload);
    return this.dishService.createDish(user?._id, payload, file, i18n);
  }

  //update dish
  @SubPermissionGuard({
    permissions: [PERMISSIONS.MENUMANAGEMENT.subPermissions.UPDATEDISH]
  })
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dish creation payload including an optional image file',
    type: UpdateDishDto,
  })
  @Validate()
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  @UseInterceptors(FileInterceptor('file'))
  async updateDish(
    @CurrentUser() user: IUser,
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() payload: UpdateDishDto,
    @UploadedFile() file: Express.Multer.File,
    @I18n() i18n: I18nContext
  ) {
    return this.dishService.editDish(user?._id, id, payload, file, i18n);
  }

  //get all dishes list
  @SubPermissionGuard({
    permissions: [PERMISSIONS.MENUMANAGEMENT.subPermissions.GETALLDISHES]
  })
  @Get()
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  async getAllDishes(
    @CurrentUser() user: IUser,
    @Query() query: BasicQueryDto,
    @I18n() i18: I18nContext
  ) {
    return await this.dishService.getAllDishes(query, i18, { vendor: user?._id });
  }

  @Validate()
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  @Get(':id')
  async getKidById(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.dishService.getDishById(id, i18n);
  }

  @Validate()
  @ApiQuery({ name: 'targetedDishId', description: 'access Dish', required: false })
  @Delete(':id')
  async deleteCatogeryById(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext
  ) {
    return this.dishService.deleteDish(id, user?._id, i18n);
  }

}
