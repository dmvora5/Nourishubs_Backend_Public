import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserManagementService } from '../../super-admin/user-management/user-management.service';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { BasicQueryDto, CurrentRole, CurrentUser, IRole, IUser, JwtAuthGuard, PermissionGuard, PERMISSIONS, ROLES, SubPermissionGuard, Validate, ValidateObjectIdPipe } from '@app/common';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UpdateUserDto } from '../../users/dtos/update-user.dto';
import { UsersService } from '../../users/users.service';
import { SuspenDto } from '../../users/dtos/suspend.dto';
@ApiBearerAuth()
@ApiTags("Admin / User-Management")
@Controller('admin-user-management')
@PermissionGuard({
  permissions: [PERMISSIONS.USERMANAGEMENT.permission],
  roles: [ROLES.ADMIN]
})
@UseGuards(JwtAuthGuard)
export class UserManagementController {
  constructor(private readonly usersService: UsersService) { }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.CREATEUSERS]
  })
  @Post('/create-user')
  @Validate()
  async createUesr(
    @Body() payload: CreateUserDto,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext
  ) {
    return await this.usersService.createUserWithRoleAndPermission(user.role, payload, i18n, user?._id);
  }



  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.GETALLUSERS]
  })
  @Get('all-users')
  async getAllPermissions(
    @Query() query: BasicQueryDto,
    @I18n() i18: I18nContext,
    @CurrentUser() user: IUser,
  ) {
    return this.usersService.getAllUsers(query, i18,user?._id);
  }



  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.SUSPENDUSERS]
  })
  @Put(':id/status')
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  @ApiOperation({
    summary: "Suspend uesr",
    description: "Suspending user by changing status to'suspended'"
  })
  async updateStatus(
    @Param('id', ValidateObjectIdPipe) userId: string,
    @Body() payload: SuspenDto,
    @CurrentRole() role: IRole,
    @CurrentUser() user: IUser,
    @I18n() i18: I18nContext

  ) {
    return this.usersService.updateStatus(user.role, payload, userId, i18);
  }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.UPDATEUSERS]
  })
  @Patch(':id')
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  async updateUser(
    @Param('id', ValidateObjectIdPipe) id: string,
    @CurrentRole() role: IRole,
    @CurrentUser() user: IUser,
    @Body() payload: UpdateUserDto,
    @I18n() i18n: I18nContext
  ) {
    return this.usersService.updateUser(user.role, id, payload, i18n);
  }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.DELETEUSERS]
  })
  @Delete(':id')
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  async softDeleteUser(
    @Param('id', ValidateObjectIdPipe) id: string,
    @CurrentRole() role: IRole,
    @CurrentUser() user: IUser,
    @I18n() i18: I18nContext
  ) {
    return await this.usersService.softDeleteUser(user.role, id, i18);
  }


  @Get('suspended-users')
  async getSuspendedAccounts(
    @Query() query: BasicQueryDto,
    @I18n() i18n: I18nContext,
    @CurrentUser() user: IUser,

  ) {
    return this.usersService.getSuspendedAccounts(query, i18n,user?._id);
  }

  @Get('statistics')
  async getAllStatistics() {
    return this.usersService.statistics();
  }


  @SubPermissionGuard({
    permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.DELETEUSERS]
  })
  @Get(':id')
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  async getUserById(
    @Param('id', ValidateObjectIdPipe) id: string,
    @CurrentRole() role: IRole,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext
  ) {
    return this.usersService.getUserById(user.role, id, i18n);
  }

}
