import { Body, Controller, Get, Patch, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ParentDashboardService } from "./parent-dashboard.service";
import { CurrentUser, IUser, JwtAuthGuard, PermissionGuard, PERMISSIONS, ROLES, SubPermissionGuard, Validate } from "@app/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { I18n, I18nContext } from "nestjs-i18n";
import { UpdateParentDto } from "./dtos/parent-dashboard.dtos";

@ApiBearerAuth()
@ApiTags("Parent / Dashboard")
@Controller('parent-dashboard')
@UseGuards(JwtAuthGuard)
export class ParentDashboardController {

  constructor(private readonly parentDashboardService: ParentDashboardService) { }

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


  @Get("/parent-details")
  async getParentDetails(
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext
  ) {
    return this.parentDashboardService.getParentDetailsById(user?._id, i18n);

  }
}
