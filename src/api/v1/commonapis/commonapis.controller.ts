import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BasicQueryDto, CurrentRole, CurrentUser, IRole, IUser, JwtAuthGuard, LOCATION, ROLES, Validate } from '@app/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UsersService } from '../users/users.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags("Common")
@Controller()
@UseGuards(JwtAuthGuard)
export class CommonapisController {
  constructor(
    private readonly userService: UsersService,
  ) { }


  @Get("/schools")
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  @Validate()
  getSchoolsList(
    @Query() query: BasicQueryDto,
    @CurrentUser() user: IUser,
    @CurrentRole() role: IRole,
    @I18n() i18n: I18nContext
  ) {

    let location;

    switch (role?._id) {
      case ROLES.SUPER_ADMIN:
        location = LOCATION.ALL;
        break;
      case ROLES.ADMIN:
        location = LOCATION.COUNTRY
        break;
      case ROLES.STATE_EXECUTIVE:
        location = LOCATION.STATE
        break;
      case ROLES.DISTRICT_EXECUTIVE:
        location = LOCATION.DISTRICT
        break;
      case ROLES.AREA_EXECUTIVE:
        location = LOCATION.CITY
        break;
      case ROLES.PARENT:
        location = LOCATION.CITY;
        break;
      default:
        location = LOCATION.CITY
        break;
    }



    return this.userService.getAllUsersWithFilters({
      query,
      user,
      roles: [ROLES.SCHOOL],
      location,
      i18n,
      baseFilter: {
        status: 'active',
        verificationStatus: 'approved',
      },
      select: 'schoolName _id'
    });
  }


}
