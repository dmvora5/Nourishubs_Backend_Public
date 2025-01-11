import { Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryDto, CurrentUser, IUser, JwtAuthGuard, LOCATION, ROLES, Validate } from '@app/common';
import { UsersService } from '../../users/users.service';
import { I18n, I18nContext } from 'nestjs-i18n';

@ApiBearerAuth()
@ApiTags('District-Executive / School-and-Vendor-Assossiate')
@Controller('school-and-vendor-assosiate')
@UseGuards(JwtAuthGuard)
export class SchoolAndVendorAssosiatesController {
  constructor(private readonly userService: UsersService) { }

  @Get('/vendors')
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  @Validate()
  async allVedors(
    @Query() query: BasicQueryDto,
    @I18n() i18n: I18nContext,
    @CurrentUser() user: IUser,
  ) {

    return this.userService.getAllUsersWithFilters({
      query,
      user,
      roles: [ROLES.VENDOR],
      location: LOCATION.DISTRICT,
      i18n,
      baseFilter: {}
    });
  }

  @Get('/schools')
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  @Validate()
  async allSchools(@Query() query: BasicQueryDto, @I18n() i18n: I18nContext, @CurrentUser() user: IUser) {
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
