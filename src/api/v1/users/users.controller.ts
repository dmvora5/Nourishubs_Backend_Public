import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentRole, CurrentUser, IRole, IUser, JwtAuthGuard, PermissionGuard, PERMISSIONS, ROLES, SkipPermissions, SubPermissionGuard, Validate, ValidateObjectIdPipe } from '@app/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { CreateUserDto } from './dtos/create-user.dto';
import { SuspenDto } from './dtos/suspend.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiBearerAuth()
@ApiTags("User")
@Controller('users')
// @PermissionGuard({
//   permissions: [PERMISSIONS.USERMANAGEMENT.permission],
//   roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STATE_EXECUTIVE, ROLES.AREA_EXECUTIVE, ROLES.DISTRICT_EXECUTIVE, ROLES.SCHOOL]
// })
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  // @SkipPermissions()
  @Get("/profile")
  async getUserDetails(
    @CurrentUser() user: IUser,
    @I18n() i18: I18nContext
  ) {
    return await this.usersService.getLoginUserById(i18, user?._id);
  }

  // @SubPermissionGuard({
  //   permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.CREATEUSERS]
  // })
  // @Post('/create-user')
  // @Validate()
  // async createUesr(
  //   @CurrentUser() user: IUser,
  //   @CurrentRole() role: IRole,
  //   @Body() payload: CreateUserDto,
  //   @I18n() i18n: I18nContext
  // ) {
  //   return await this.usersService.createUserWithRoleAndPermission(role, payload, i18n, user?._id);

  // }


  // @SubPermissionGuard({
  //   permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.SUSPENDUSERS]
  // })
  // @Put(':id/status')
  // @ApiOperation({
  //   summary: "Suspend uesr",
  //   description: "Suspending user by changing status to'suspended'"
  // })
  // async updateStatus(
  //   @Param('id', ValidateObjectIdPipe) userId: string,
  //   @Body() payload: SuspenDto,
  //   @CurrentRole() role: IRole,
  //   @I18n() i18: I18nContext

  // ) {
  //   return this.usersService.updateStatus(role, payload, userId, i18);
  // }


  // @SubPermissionGuard({
  //   permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.UPDATEUSERS]
  // })
  // @Patch(':id')
  // async updateUser(
  //   @Param('id', ValidateObjectIdPipe) id: string,
  //   @CurrentRole() role: IRole,
  //   @Body() payload: UpdateUserDto,
  //   @I18n() i18n: I18nContext
  // ) {
  //   return this.usersService.updateUser(role, id, payload, i18n);
  // }

  // @SubPermissionGuard({
  //   permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.DELETEUSERS]
  // })
  // @Delete(':id')
  // async softDeleteUser(
  //   @Param('id', ValidateObjectIdPipe) id: string,
  //   @CurrentRole() role: IRole,
  //   @I18n() i18: I18nContext
  // ) {
  //   return await this.usersService.softDeleteUser(role, id, i18);
  // }


  // @SubPermissionGuard({
  //   permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.DELETEUSERS]
  // })
  // @Get(':id')
  // async getUserById(
  //   @Param('id', ValidateObjectIdPipe) id: string,
  //   @CurrentRole() role: IRole,
  //   @I18n() i18n: I18nContext
  // ) {
  //   return this.usersService.getUserById(role, id, i18n);
  // }

}
