import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ModifierService } from './modifier.service';
import { BasicQueryDto, CurrentUser, IUser, JwtAuthGuard, PermissionGuard, PERMISSIONS, ROLES, SubPermissionGuard, Validate, ValidateObjectIdPipe } from '@app/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ModifierDto } from './dtos/modifier.dtos';
import { I18n, I18nContext } from 'nestjs-i18n';

@ApiBearerAuth()
@ApiTags("Vendor / Modifier")
@Controller('modifier')
@PermissionGuard({
  permissions: [PERMISSIONS.MENUMANAGEMENT.permission],
  roles: [ROLES.VENDOR]
})
@UseGuards(JwtAuthGuard)
export class ModifierController {
  constructor(private readonly modifierService: ModifierService) { }

  //create modifier
  @SubPermissionGuard({
    permissions: [PERMISSIONS.MENUMANAGEMENT.subPermissions.CREATEMODIFIER]
  })
  @Post()
  @Validate()
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  async createModifier(@CurrentUser() user: IUser, @Body() payload: ModifierDto, @I18n() i18n: I18nContext) {
    console.log(payload);
    return this.modifierService.createModifier(user?._id, payload, i18n);
  }

  //update modifier
  @SubPermissionGuard({
    permissions: [PERMISSIONS.MENUMANAGEMENT.subPermissions.UPDATEMODIFIER]
  })
  @Patch(':id')
  @Validate()
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  async updateModifier(
    @CurrentUser() user: IUser,
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() payload: ModifierDto,
    @I18n() i18n: I18nContext
  ) {
    return this.modifierService.updateModifier(user?._id, id, payload, i18n);
  }

  //get all vendor modifier
  @SubPermissionGuard({
    permissions: [PERMISSIONS.MENUMANAGEMENT.subPermissions.GETALLMODIFIERS]
  })
  @Get()
  async getAllModifiers(
    @CurrentUser() user: IUser,
    @Query() query: BasicQueryDto,
    @I18n() i18n: I18nContext
  ) {
    return this.modifierService.getAllModifiers(query, i18n, { vendor: user?._id });
  }

  @Validate()
  @ApiQuery({ name: 'targetedUserId', description: 'access users', required: false })
  @Get(':id')
  async getModifierById(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.modifierService.getModifierById(id, i18n);
  }

  @Validate()
  @ApiQuery({ name: 'targetedModifierId', description: 'access Modifier', required: false })
  @Delete(':id')
  async deleteModifierById(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
    @I18n() i18n: I18nContext
  ) {
    return this.modifierService.deleteModifier(id, user?._id, i18n);
  }
}
