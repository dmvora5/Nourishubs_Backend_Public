import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { BasicQueryDto, CurrentRole, CurrentUser, IRole, IUser, JwtAuthGuard, PermissionGuard, PERMISSIONS, ROLES, SubPermissionGuard, Validate, ValidateObjectIdPipe } from '@app/common';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UpdateUserDto } from '../../users/dtos/update-user.dto';
import { SuspenDto } from '../../users/dtos/suspend.dto';
import { UsersService } from '../../users/users.service';

@ApiBearerAuth()
@ApiTags("Super-Admin / User-Management")
@Controller('super-admin-user-management')
@PermissionGuard({
  permissions: [PERMISSIONS.USERMANAGEMENT.permission],
  roles: [ROLES.SUPER_ADMIN]
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
      @CurrentRole() role: IRole,
      @I18n() i18n: I18nContext
    ) {
      return await this.usersService.createUserWithRoleAndPermission(user.role, payload, i18n, user?._id);
    }
  
  
  
    @SubPermissionGuard({
      permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.GETALLUSERS]
    })
    @Get('all-users')
    @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
    @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
    @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
    @Validate()
    async getAllPermissions(
      @Query() query: BasicQueryDto,
      @I18n() i18: I18nContext,
    ) {
      return this.usersService.getAllUsers(query, i18);
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
    @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
    @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
    @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
    @Validate()
    async getSuspendedAccounts(
      @Query() query: BasicQueryDto,
      @I18n() i18n: I18nContext,
    ) {
      return this.usersService.getSuspendedAccounts(query, i18n);
    }
  
    @Get('statistics')
    async getAllStatistics() {
      return this.usersService.statistics();
    }
  
  
    @SubPermissionGuard({
      permissions: [PERMISSIONS.USERMANAGEMENT.subPermissions.DELETEUSERS]
    })
    @Get(':id')
    async getUserById(
      @Param('id', ValidateObjectIdPipe) id: string,
      @CurrentRole() role: IRole,
      @CurrentUser() user: IUser,
      @I18n() i18n: I18nContext
    ) {
      return this.usersService.getUserById(user.role, id, i18n);
    }
}
