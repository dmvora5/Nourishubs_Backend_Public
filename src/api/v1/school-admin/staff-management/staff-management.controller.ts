import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryDto, CurrentRole, CurrentUser, IRole, IUser, JwtAuthGuard, LOCATION, PermissionGuard, PERMISSIONS, ROLES, SubPermissionGuard, Validate, ValidateObjectIdPipe } from '@app/common';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { I18n, I18nContext } from 'nestjs-i18n';

@ApiBearerAuth()
@ApiTags("SchoolAdmin / StaffManagement")
@Controller('staff-management')
@PermissionGuard({
  permissions: [PERMISSIONS.USERMANAGEMENT.permission],
  roles: [ROLES.SCHOOL],
})
@UseGuards(JwtAuthGuard)
export class StaffManagementController {
  constructor(
    private readonly userService: UsersService,
  ) { }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.CREATEUSERS]
  })
  @Post()
  @Validate()
  async createStaffMember(
    @CurrentUser() user: IUser,
    @CurrentRole() role: IRole,
    @Body() payload: CreateUserDto,
    @I18n() i18n: I18nContext
  ) {
    return this.userService.createUserWithRoleAndPermission(role, payload, i18n, user?._id)

  }



  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.GETALLUSERS]
  })
  @Get()
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  @Validate()
  async getAllStaffMembers(
    @CurrentUser() user: IUser,
    @Query() query: BasicQueryDto,
    @I18n() i18n: I18nContext
  ) {
    return this.userService.getAllUsersWithFilters({
      query,
      user,
      roles: [ROLES.TEACHER, ROLES.SCHOOLOTHERS],
      i18n,
      baseFilter: { schoolId: user?._id }
    });
  }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.GETUSERDETAILS]
  })
  @Get(":id")
  async getStaffMemberdetailById(
    @Param('id', ValidateObjectIdPipe) id: string,
    @CurrentUser() user: IUser,
    @CurrentRole() role: IRole,
    @I18n() i18n: I18nContext
  ) {
    return this.userService.getUserById(role, id, i18n);
  }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.DELETEUSERS]
  })
  @Delete(':id')
  async softDeleteUser(
    @Param('id', ValidateObjectIdPipe)
    id: string,
    @CurrentUser() user: IUser,
    @CurrentRole() role: IRole,
    @I18n() i18n: I18nContext
  ) {
    return await this.userService.softDeleteUser(role, id, i18n);
  }



}
