import { Controller, Get, Patch,Query, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryDto, CurrentUser, IUser, JwtAuthGuard, LOCATION, ROLES, Validate,ValidateObjectIdPipe } from '@app/common';
import { UsersService } from '../../users/users.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { VendorManagementService } from 'src/modules/vendor-management/vendor-management.service';
@ApiBearerAuth()
@ApiTags('District-Executive / School-and-Vendor-Assossiate')
@Controller('school-and-vendor-assosiate')
@UseGuards(JwtAuthGuard)
export class SchoolAndVendorAssosiatesController {
  constructor(
    private readonly userService: UsersService,
    private readonly vendorManagementService: VendorManagementService,

  ) { }

  @Get('/vendors')
  @Validate()
  async allVedors(
    @I18n() i18n: I18nContext,
    @CurrentUser() user: IUser,
  ) {
    return this.vendorManagementService.allApprovedVendors(    
      user,
      LOCATION.DISTRICT,
      i18n,
    );
  }

  @Get('/user/:id')
  @Validate()
  async getVendor(
    @Param('id', ValidateObjectIdPipe) id: string,
    @I18n() i18n: I18nContext,
  ) {
    return this.vendorManagementService.getVendorById(    
      id,
      i18n,
    );
  }

  @Get('/schools')
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  @Validate()
  async allSchools(
    @Query() query: BasicQueryDto,
    @I18n() i18n: I18nContext, @CurrentUser() user: IUser) {
    return this.userService.getAllUsersWithFilters({
      query,
      user,
      roles: [ROLES.SCHOOL],
      location: LOCATION.DISTRICT,
      i18n,
      baseFilter: {},
      select: 'schoolName profileImage expectedDeliveryTime'
    });
  }


}
