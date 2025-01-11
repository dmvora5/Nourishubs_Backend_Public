import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser, IUser, JwtAuthGuard, LOCATION, PermissionGuard, PERMISSIONS, REQUEST_USER_TYPE, ROLES, SubPermissionGuard, Validate, ValidateObjectIdPipe } from '@app/common';
import { SchoolQueryDto } from './dtos/schools-and-vendor-verify.dtos';
import { I18n, I18nContext } from 'nestjs-i18n';
import { VerificationRequestsService } from 'src/modules/verification-requests/verification-requests.service';
import { CloseRequestDto } from 'src/modules/verification-requests/dtos/requests.dto';

@ApiBearerAuth()
@ApiTags("District-Executive / School-and-Vendor-Verify")
@Controller('school-and-vendor-verify')
@PermissionGuard({
  permissions: [PERMISSIONS.USERMANAGEMENT.permission],
  roles: [ROLES.DISTRICT_EXECUTIVE]
})
@UseGuards(JwtAuthGuard)
export class SchoolAndVendorVerifyController {
  constructor(
    private readonly verificationRequestService: VerificationRequestsService
  ) { }



  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.VERIFICATIONREQUESTS]
  })
  @Get('school-documnet-requests')
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  @Validate()
  async documentVerificationList(
    @Query() query: SchoolQueryDto,
    @I18n() i18n: I18nContext,
    @CurrentUser() user: IUser,

  ) {
    return this.verificationRequestService.getAllPendingDocumentVerifications(
      query,
      user,
      REQUEST_USER_TYPE.SCHOOL,
      LOCATION.DISTRICT,
      i18n,
      query.schoolId
    );
  }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.VERIFYUSER]
  })
  @Get('document/:id')
  async documentById(
    @Param('id', ValidateObjectIdPipe) id: string,
    @I18n() i18n: I18nContext,
  ) {
    return this.verificationRequestService.getDocumentRequestById(id, i18n);
  }



  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.VERIFYUSER]
  })
  @Patch('document-request/:id')
  @Validate()
  async documentRequest(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() payload: CloseRequestDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.verificationRequestService.closeDocumentRequest(
      id,
      payload,
      REQUEST_USER_TYPE.SCHOOL,
      i18n,
    );
  }


}
