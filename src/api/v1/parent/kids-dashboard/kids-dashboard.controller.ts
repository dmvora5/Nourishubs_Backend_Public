import { BasicQueryDto, CurrentUser, IUser, JwtAuthGuard, PermissionGuard, PERMISSIONS, ROLES, SubPermissionGuard, Validate, ValidateObjectIdPipe } from "@app/common";
import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { I18n, I18nContext } from "nestjs-i18n";
import { CreateKidsDto, UpdateKidsDto } from "src/modules/kids/dtos/kids-dashboards.dtos";
import { KidService } from "src/modules/kids/kid.service";

@ApiBearerAuth()
@ApiTags("Parent / Kids-Dashboard")
@Controller('kids-dashboard')
@PermissionGuard({
  permissions: [PERMISSIONS.KIDSMANAGEMENT.permission],
  roles: [ROLES.PARENT]
})
@UseGuards(JwtAuthGuard)
export class KidsDashboardController {
  constructor(private readonly kidService: KidService) {}

  @SubPermissionGuard({
    permissions: [PERMISSIONS.KIDSMANAGEMENT.subPermissions.GETALLKIDS],
    passthrough: true
  })
  @Get()
  async getAllUsers(
    @Query() query: BasicQueryDto,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext,
  ) {
    return this.kidService.getAllKids(user?._id, query, i18n);
  }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.KIDSMANAGEMENT.subPermissions.CREATEKID],
    passthrough: true
  })
  @Post('/create')
  @ApiConsumes('multipart/form-data')
  @Validate()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createKidsDto: CreateKidsDto,
    @UploadedFile() file: Express.Multer.File,
    @I18n() i18n: I18nContext,
    @CurrentUser() user: IUser,

  ) {
    console.log('this.kidService', this.kidService)
    return this.kidService.createKid(createKidsDto, file, i18n, user?._id);
  }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.KIDSMANAGEMENT.subPermissions.UPDATEKID],
    passthrough: true
  })
  @ApiConsumes('multipart/form-data')
  @Patch('/update/:id')
  @Validate()
  @UseInterceptors(FileInterceptor('file'))
  async updateKid(
    @Param('id', ValidateObjectIdPipe) id: string,
    @CurrentUser() user: IUser,
    @Body() payload: UpdateKidsDto,
    @UploadedFile() file: Express.Multer.File,
    @I18n() i18n: I18nContext,
  ) {
    return this.kidService.updateKid(id, user?._id, payload, file, i18n);
  }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.KIDSMANAGEMENT.subPermissions.GETKIDDETAILS],
    passthrough: true
  })
  @Get(':id')
  async getKidById(
    @Param('id', ValidateObjectIdPipe) id: string,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext
  ) {
    return this.kidService.getKidById(user?._id, id, i18n);
  }

}
