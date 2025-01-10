import { Body, Controller, Get, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { VendorProfileService } from './vendor-profile.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser, IUser, JwtAuthGuard, PermissionGuard, PERMISSIONS, REQUEST_USER_TYPE, ROLES, SubPermissionGuard, Validate } from '@app/common';
import { FileUploadDto, UpdateVendorDto } from './dtos/vendor.dtos';
import { I18n, I18nContext } from 'nestjs-i18n';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '@app/common/services';
import { DocumentRequestDto, ThressHoldRequestDto } from 'src/modules/verification-requests/dtos/requests.dto';
import { VerificationRequestsService } from 'src/modules/verification-requests/verification-requests.service';

@ApiBearerAuth()
@ApiTags("Vendor / Profile-Management")
@Controller('vendor')
@PermissionGuard({
  permissions: [PERMISSIONS.VENDORPERMISSIONS.permission],
  roles: [ROLES.VENDOR]
})
@UseGuards(JwtAuthGuard)
export class VendorProfileController {
  constructor(
    private readonly vendorProfileService: VendorProfileService,
    private readonly verificationRequestService: VerificationRequestsService,
    private readonly uploadService: UploadService,
  ) { }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.VENDORPERMISSIONS.subPermissions.UPDATEPROFILE],
    passthrough: true,
  })
  @Patch()
  @Validate()
  async updateVendorProfile(
    @CurrentUser() user: IUser,
    @Body() payload: UpdateVendorDto,
    @I18n() i18n: I18nContext
  ) {
    return this.vendorProfileService.updateVendor(user?._id, payload, i18n);
  }




  @SubPermissionGuard({
    permissions: [PERMISSIONS.VENDORPERMISSIONS.subPermissions.UPDATEPROFILE],
    passthrough: true,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'upload profile image',
    type: FileUploadDto
  })
  @Post('upload-profile-image')
  @UseInterceptors(FileInterceptor('file')) // The file field name in the form-data
  async uploadProfileImage(@CurrentUser() user: IUser, @UploadedFile() file: Express.Multer.File, @I18n() i18n: I18nContext) {
    const url = await this.uploadService.uploadImage(file, 'profile-images', i18n);
    return this.vendorProfileService.updateProfileImage(user?._id, url, i18n);

  }




  @SubPermissionGuard({
    permissions: [PERMISSIONS.VENDORPERMISSIONS.subPermissions.UPDATEPROFILE],
    passthrough: true,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'upload document',
    type: FileUploadDto
  })
  @Post('upload-document')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(@CurrentUser() user: IUser, @UploadedFile() file: Express.Multer.File, @Body('docType') docType: string, @I18n() i18n: I18nContext) {
    const url = await this.uploadService.uploadDocument(file, 'documents', i18n);
    return this.vendorProfileService.uploadDocument(user?._id, url, docType, i18n);

  }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.VENDORPERMISSIONS.subPermissions.THRESHOLDREQUEST],
    passthrough: true,
  })
  @Post("/request-threshold")
  @Validate()
  async genrateThresHoldRequest(
    @CurrentUser() user: IUser,
    @Body() payload: ThressHoldRequestDto,
    @I18n() i18n: I18nContext
  ) {
    return this.verificationRequestService.generateThresholdrequest(user?._id, payload, i18n);
  }



  @SubPermissionGuard({
    permissions: [PERMISSIONS.VENDORPERMISSIONS.subPermissions.DOCUMENTVERIFICATIONREQUEST],
    passthrough: true,
  })
  @Post("/request-document")
  @Validate()
  async genrateDocumentsRequest(
    @CurrentUser() user: IUser,
    @Body() payload: DocumentRequestDto,
    @I18n() i18n: I18nContext
  ) {
    return this.verificationRequestService.generateDocumentRequest(
      user?._id,
      payload,
      REQUEST_USER_TYPE.VENDOR,
      i18n
    );
  }


  @Get('/details')
  async getUserById(
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext
  ) {
    return this.vendorProfileService.getUserById(user?._id, i18n);
  }


}
