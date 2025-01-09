import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { UsernotificationService } from './usernotification.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryDto, CurrentRole, CurrentUser, IRole, IUser, JwtAuthGuard, ValidateObjectIdPipe } from '@app/common';
import { I18n, I18nContext } from 'nestjs-i18n';

@ApiBearerAuth()
@ApiTags("Usernotification")
@Controller('usernotification')
@UseGuards(JwtAuthGuard)
export class UsernotificationController {
  constructor(private readonly usernotificationService: UsernotificationService) { }


  @Get()
  async getUserNotifications(
    @CurrentUser() user: IUser,
    @CurrentRole() role: IRole,
    @I18n() i18n: I18nContext
  ) {
    return this.usernotificationService.getUserStatusNotifications(user?._id, role?._id, i18n);
  }

  @Get("/list")
  @ApiQuery({ name: 'page', description: 'pagenumber', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'records per page', required: false, example: 10 })
  @ApiQuery({ name: 'searchQuery', description: 'SearchQuery', required: false })
  async getUserNotificationsList(
    @CurrentUser() user: IUser,
    @CurrentRole() role: IRole,
    @Query() query: BasicQueryDto,
    @I18n() i18n: I18nContext
  ) {
    return this.usernotificationService.getNotificationLists(user?._id, role?._id, query, i18n);
  }

  @Patch("/read-all")
  async readAllNotifications(
    @CurrentUser() user: IUser, 
    @I18n() i18n: I18nContext
  ) {
    return this.usernotificationService.readAllNotifications(user?._id, i18n);
  }


  @Patch("/:id")
  async readNotification(
    @Param('id', ValidateObjectIdPipe) id: string, 
    @CurrentUser() user: IUser, 
    @I18n() i18n: I18nContext
  ) {
    return this.usernotificationService.readNotifications(user?._id, id, i18n);
  }

}
