import { Body, Controller, Delete, Get, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { SchoolAdminDashboardService } from './school-admin-dashboard.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryDto, CurrentUser, IUser, JwtAuthGuard, PermissionGuard, PERMISSIONS, ROLES, SubPermissionGuard, Validate } from '@app/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { DeleteDocumentDto, RequestDto, UpdateSchoolDto } from './dtos/school-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from '../../vendor/vendor-profile/dtos/vendor.dtos';
import { UploadService } from '@app/common/services';

@ApiBearerAuth()
@ApiTags("SchoolAdmin / DashBoard")
@Controller('school-admin-dashboard')
@PermissionGuard({
  permissions: [PERMISSIONS.SCHOOLADMINDASHBOARD.permission],
  roles: [ROLES.SCHOOL]
})
@UseGuards(JwtAuthGuard)
export class SchoolAdminDashboardController {
  constructor(
    private readonly schoolAdminDashboardService: SchoolAdminDashboardService,
    private readonly uploadService: UploadService,
  ) { }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.SCHOOLADMINDASHBOARD.subPermissions.PARENTREGISTRATIONREQUESTLIST],
  })
  @Get('/registration-requests')
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  @Validate()
  getParentsrequest(
    @CurrentUser() user: IUser,
    @Query() query: BasicQueryDto,
    @I18n() i18: I18nContext
  ) {
    return this.schoolAdminDashboardService.getParentsRequest(user?._id, query, i18);
  }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.SCHOOLADMINDASHBOARD.subPermissions.HANDLEREGISTRATIONREQUEST]
  })
  @Post("/update-request-status")
  @Validate()
  async updateRequestStates(
    @Body() payload: RequestDto,
    @I18n() i18n: I18nContext
  ) {
    return this.schoolAdminDashboardService.handleRequest(payload, i18n);
  }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.SCHOOLADMINDASHBOARD.subPermissions.UPDATEPSCHOOLADMINROFILE],
    passthrough: true
  })
  @UseInterceptors(FileInterceptor('file'))
  @Patch()
  async updateSchoolAdmin(
    @CurrentUser() user: IUser,
    @Body() payload: UpdateSchoolDto,
    @UploadedFile() file: Express.Multer.File,
    @I18n() i18n: I18nContext
  ) {
    return this.schoolAdminDashboardService.updateSchoolAdmin(user?._id, payload, file, i18n);
  }


  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'upload document',
    type: FileUploadDto
  })
  @Post('upload-document')

  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @CurrentUser() user: IUser,
    @UploadedFile() file: Express.Multer.File,
    @Body('docType') docType: string,
    @I18n() i18n: I18nContext
  ) {
    const url = await this.uploadService.uploadDocument(file, 'documents', i18n);
    return this.schoolAdminDashboardService.uploadDocument(user?._id, url, docType, i18n);

  }


  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'upload profile image',
    type: FileUploadDto
  })
  @Post('upload-profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(@CurrentUser() user: IUser, @UploadedFile() file: Express.Multer.File, @I18n() i18n: I18nContext) {
    const url = await this.uploadService.uploadImage(file, 'profile-images', i18n);
    return this.schoolAdminDashboardService.updateProfileImage(user?._id, url, i18n);
  }


  // @Delete('delete-document')
  // async deleteDocument(@CurrentUser() user: IUser, @Body() payload: DeleteDocumentDto, @I18n() i18n: I18nContext) {
  //   return this.schoolAdminDashboardService.deleteDocument(user?._id, payload.docType, i18n);
  // }

}
