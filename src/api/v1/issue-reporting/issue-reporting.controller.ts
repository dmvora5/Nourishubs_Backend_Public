import {
    Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IssueReportingService } from './issue-reporting.service';
import { CreateIssueDto } from './dtos/issueReporting.dtos';
import { I18n, I18nContext } from 'nestjs-i18n';
import {
  BasicQueryDto,
  CurrentUser,
  IUser,
  JwtAuthGuard,
  Validate,
} from '@app/common';

@ApiBearerAuth()
@ApiTags('Issue Reporting') // Groups this controller in Swagger
@Controller('issue-reporting')
@UseGuards(JwtAuthGuard)
export class IssueReportingController {
  constructor(
    private readonly issueReportingService: IssueReportingService,
  ) {}

  @Post('/create')
  @Validate()
  @ApiOperation({ summary: 'Create a new issue' })
  @ApiBody({ type: CreateIssueDto, description: 'Issue details' }) // Document request body
  @ApiResponse({ status: 201, description: 'Issue created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(
    @CurrentUser() user: IUser,
    @Body() body: CreateIssueDto, // Use @Body here
    @I18n() i18n: I18nContext,
  ) {
    console.log('Create issue DTO:', user?._id, body);
    return this.issueReportingService.createIssue(user, body, i18n);
  }

  @Get('/issue-list')
  @ApiOperation({ summary: 'Get a paginated list of issues by loggedIn User' })
  @ApiResponse({
      status: 200,
      description: 'List of issues.',
  })
  async getIssueList(
      @Query() query: BasicQueryDto,
      @CurrentUser() user: IUser, // Accept JSON as a string
      @I18n() i18: I18nContext,
  ) {
      return this.issueReportingService.getIssueList(query, user?._id, i18);
  }

  @Get('/kids')
  @Validate()
  @ApiOperation({ summary: 'Get Kid List of LoggeIn Parent' })
  @ApiResponse({ status: 201, description: 'Get Kid list successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async getAllUsers(@CurrentUser() user: IUser, @I18n() i18n: I18nContext) {
    return this.issueReportingService.getKidList(user?._id, i18n);
  }

  @Get('/available-dates/:kidId')
  @Validate()
  @ApiOperation({ summary: 'List Of dates when ordered placed for kids' })
  @ApiResponse({ status: 201, description: 'Issue created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async getAvailableDates(
    @Param('kidId') kidId: string,
    @I18n() i18n: I18nContext,
  ) {
    return this.issueReportingService.getAvailableDates(kidId, i18n);
  }

  @Get('/available-dates-for-staff')
  @Validate()
  @ApiOperation({ summary: 'List Of dates when ordered placed by staff' })
  @ApiResponse({ status: 201, description: 'Issue created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async getAvailableDatesForStaff(
    @CurrentUser() user: IUser, 
    @I18n() i18n: I18nContext,
  ) {
    return this.issueReportingService.getAvailableDatesForStaff(user?._id, i18n);
  }

  @Get('/static-issues')
  @ApiOperation({ summary: 'Get static issues' })
  @ApiResponse({ status: 200, description: 'Static Issues' })
  @ApiResponse({ status: 404, description: 'Static Issues not found' })
  async getStaticList(@I18n() i18n: I18nContext) {
    return this.issueReportingService.getStaticIssues(i18n);
  }

  @Get('/issueCount')
  @ApiOperation({ summary: 'Get Issues Count' })
  @ApiResponse({ status: 200, description: 'Issues Count Get Succesfully' })
  @ApiResponse({ status: 404, description: 'Issues not found' })
  async issueCount(@CurrentUser() user: IUser, @I18n() i18n: I18nContext) {
    return this.issueReportingService.getTotalIssueCount(user?._id, i18n);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get issue by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Issue ID' }) // Document path parameter
  @ApiResponse({ status: 200, description: 'Issue details' })
  @ApiResponse({ status: 404, description: 'Issue not found' })
  async getIssueById(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.issueReportingService.getIssueById(id, i18n);
  }
}
