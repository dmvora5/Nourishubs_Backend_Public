import { BasicQueryDto, CurrentUser, IUser, JwtAuthGuard, LOCATION, PermissionGuard, PERMISSIONS, REQUEST_USER_TYPE, ROLES, SubPermissionGuard, Validate, ValidateObjectIdPipe } from '@app/common';
import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { SuspenVendorDto } from 'src/modules/vendor-management/dtos/vendors.dtos';
import { VendorManagementService } from 'src/modules/vendor-management/vendor-management.service';
import { CloseRequestDto } from 'src/modules/verification-requests/dtos/requests.dto';
import { VerificationRequestsService } from 'src/modules/verification-requests/verification-requests.service';

@ApiBearerAuth()
@ApiTags("SuperAdmin / Vendor-Management")
@Controller('super-admin-vendor-management')
@PermissionGuard({
  permissions: [PERMISSIONS.USERMANAGEMENT.permission],
  roles: [ROLES.SUPER_ADMIN]
})

@UseGuards(JwtAuthGuard) export class SuperAdminVendormanagementController {
  constructor(
    private readonly vendormanagementService: VendorManagementService,
    private readonly verificationRequestServices: VerificationRequestsService
  ) { }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.GETALLUSERS]
  })
  @Get()
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  @Validate()
  async getAllVendors(
    @Query() query: BasicQueryDto,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext,
  ) {
    return this.vendormanagementService.allVendors(
      query,
      user,
      LOCATION.ALL,
      i18n
    );
  }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.VERIFICATIONREQUESTS]
  })
  @Get('documnets')
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  @Validate()
  async documentVerificationList(
    @Query() query: BasicQueryDto,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext,
  ) {
    return this.verificationRequestServices.getAllPendingDocumentVerifications(
      query,
      user,
      REQUEST_USER_TYPE.VENDOR,
      LOCATION.ALL,
      i18n,
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
    return this.verificationRequestServices.getDocumentRequestById(id, i18n);
  }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.VERIFICATIONREQUESTS]
  })
  @Get('threshold')
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  @Validate()
  async thresholdtVerificationList(
    @Query() query: BasicQueryDto,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext,
  ) {
    return this.verificationRequestServices.getAllPendingThresHoldVerifications(
      query,
      user,
      LOCATION.ALL,
      i18n,
    );
  }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.SUSPENDUSERS]
  })
  @Patch('suspend/:id')
  @Validate()
  async suspendVendor(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() payload: SuspenVendorDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.vendormanagementService.suspendVendor(
      id,
      payload,
      i18n,
    );
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
    return this.verificationRequestServices.closeDocumentRequest(
      id,
      payload,
      REQUEST_USER_TYPE.VENDOR,
      i18n,
    );
  }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.VERIFYUSER]
  })
  @Patch('threshold-request/:id')
  @Validate()
  async thresholdRequest(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() payload: CloseRequestDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.verificationRequestServices.closeThresHoldRequest(
      id,
      payload,
      i18n,
    );
  }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.VERIFYUSER]
  })
  @Get('/:id')
  async getVendorById(
    @Param('id', ValidateObjectIdPipe) id: string,
    @I18n() i18n: I18nContext,
  ) {
    return this.vendormanagementService.getVendorById(id, i18n);
  }



}
