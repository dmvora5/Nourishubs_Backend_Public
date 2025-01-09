import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FoodcategoryService } from './foodcategory.service';
import { BasicQueryDto, CurrentUser, IUser, JwtAuthGuard, PermissionGuard, PERMISSIONS, ROLES, SubPermissionGuard, Validate } from '@app/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFoodCategoryDto, UpdateFoodCategoryDto } from './dtos/foodCategory.dtos';
import { I18n, I18nContext } from 'nestjs-i18n';

@ApiBearerAuth()
@ApiTags("Vendor / FoodCategory")
@Controller('foodcategory')
@PermissionGuard({
  permissions: [PERMISSIONS.MENUMANAGEMENT.permission],
  roles: [ROLES.VENDOR]
})
@UseGuards(JwtAuthGuard)
export class FoodcategoryController {
  constructor(private readonly foodcategoryService: FoodcategoryService) { }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.MENUMANAGEMENT.subPermissions.CREATECATEGORY]
  })
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dish creation payload including an optional image file',
    type: CreateFoodCategoryDto,
  })
  @Validate()
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  @UseInterceptors(FileInterceptor('file'))
  async createCategory(@CurrentUser() user: any, @Body() payload: CreateFoodCategoryDto, @UploadedFile() file: Express.Multer.File, @I18n() i18n: I18nContext) {

    return this.foodcategoryService.createCategory(user?._id, payload.name, file, i18n);
  }

  //get all categorys
  @SubPermissionGuard({
    permissions: [PERMISSIONS.MENUMANAGEMENT.subPermissions.GETALLCATEGORY]
  })
  @Get()
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  findAll(
    @CurrentUser() user: any,
    @Query() query: BasicQueryDto,
    @I18n() i18: I18nContext
  ) {
    return this.foodcategoryService.getAllCategories(user?._id, query, i18);
  }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.MENUMANAGEMENT.subPermissions.UPDATECATEGORY]
  })
  @Patch("/:id")
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dish creation payload including an optional image file',
    type: UpdateFoodCategoryDto,
  })
  @Validate()
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  @UseInterceptors(FileInterceptor('file'))
  updatecategory(@Param('id') id: string, @Body() body: UpdateFoodCategoryDto, @I18n() i18n: I18nContext, @UploadedFile() file: Express.Multer.File,) {
    return this.foodcategoryService.updateCatgory(id, body.name, i18n, file)
  }

  @Get(':id')
  @ApiQuery({ name: 'targetedCategoryId', description: 'access category', required: false })
  @Validate()
  async getCatogeryById(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.foodcategoryService.getCatogeryById(id, i18n);
  }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.MENUMANAGEMENT.subPermissions.DELETECATEGORY]
  })
  @Validate()
  @ApiQuery({ name: 'targetedCategoryId', description: 'access category', required: false })
  @Delete(':id')
  async deleteCatogeryById(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext
  ) {
    return this.foodcategoryService.deleteCategory(id, user?._id, i18n);
  }

}


