import { Body, Controller, Get, Patch, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ParentDashboardService } from "./parent-dashboard.service";
import { CurrentUser, IUser, PermissionGuard, PERMISSIONS, ROLES, SubPermissionGuard, Validate } from "@app/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { I18n, I18nContext } from "nestjs-i18n";
import { UpdateParentDto } from "./dtos/parent-dashboard.dtos";

@ApiBearerAuth()
@ApiTags("Parent / Dashboard")
@Controller('parent-dashboard')
@PermissionGuard({
  permissions: [PERMISSIONS.PARENTSPROFILE.permission],
  roles: [ROLES.PARENT]
})
export class ParentDashboardController {

  constructor(private readonly parentDashboardService: ParentDashboardService) { }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.PARENTSPROFILE.subPermissions.UPDATEPROFILE],
    passthrough: true
  })
  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')

  @Validate()
  async updateParent(
    @CurrentUser() user: IUser,
    @Body() payload: UpdateParentDto,
    @UploadedFile() file: Express.Multer.File,
    @I18n() i18n: I18nContext
  ) {
    return this.parentDashboardService.updateParent(user?._id, payload, file, i18n);
  }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.PARENTSPROFILE.subPermissions.GETDETAILS],
    passthrough: true
  })
  @Get("/parent-details")
  async getParentDetails(
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext
  ) {
    return this.parentDashboardService.getParentDetailsById(user?._id, i18n);

  }
}
