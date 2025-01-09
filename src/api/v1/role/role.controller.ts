import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { BasicQueryDto, CurrentRole, IRole, JwtAuthGuard, PermissionGuard, PERMISSIONS, ROLES, SubPermissionGuard } from '@app/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';

@ApiBearerAuth()
@ApiTags("Role")
@Controller('role')
@PermissionGuard({
  permissions: [PERMISSIONS.ROLEMANAGEMENT.permission],
  roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STATE_EXECUTIVE, ROLES.DISTRICT_EXECUTIVE, ROLES.AREA_EXECUTIVE, ROLES.SCHOOL],
})
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @SubPermissionGuard({
    permissions: [PERMISSIONS.ROLEMANAGEMENT.subPermissions.GETROLES]
  })
  @Get()
  async getAllRoles(
    @CurrentRole() role: IRole,
    @I18n() i18: I18nContext
  ) {
    return this.roleService.getRoles(role?.childRoles, i18);
  }


  @Get("/role-permissions/:id")
  async getRolePermissions(
    @Param('id') roleId: string,
    @CurrentRole() role: IRole,
    @I18n() i18: I18nContext
  ) {
    return this.roleService.getRolePermissions(roleId, role, i18);
  }


}
