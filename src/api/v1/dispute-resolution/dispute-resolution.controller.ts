import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
    ApiConsumes,
} from '@nestjs/swagger';
import {
    CreateDisputeDto,
    ResponseDisputeDto,
    UpdateDisputeDto,
} from './dtos/disputeResolution.dtos';
import { I18n, I18nContext } from 'nestjs-i18n';
import { FileInterceptor } from '@nestjs/platform-express';
import { DisputeResolutionService } from './dispute-resolution.service';
import { BasicQueryDto, Validate } from '@app/common';

@ApiTags('Dispute Resolution')
@Controller('dispute')
export class DisputeResolutionController {
    constructor(
        private readonly disputeResolutionService: DisputeResolutionService,
    ) { }

    @Post('/create')
    @Validate()
    @ApiOperation({ summary: 'Create a new dispute issue' })
    @ApiBody({ type: CreateDisputeDto })
    @ApiResponse({
        status: 201,
        description: 'Dispute successfully created.',
    })
    @ApiResponse({
        status: 400,
        description: 'Validation error.',
    })
    async create(
        @Body() CreateDisputeDto: CreateDisputeDto,
        @I18n() i18n: I18nContext,
    ) {
        console.log('Create issue DTO:', CreateDisputeDto); // Debug log
        return this.disputeResolutionService.createDispute(CreateDisputeDto, i18n);
    }

    @Patch('/response/:id')
    @UsePipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    )
    @ApiOperation({ summary: 'Update response to a dispute' })
    @ApiParam({ name: 'id', description: 'Dispute ID', type: String })
    @ApiBody({ type: ResponseDisputeDto })
    @ApiResponse({
        status: 200,
        description: 'Dispute response successfully updated.',
    })
    @ApiResponse({
        status: 400,
        description: 'Validation error.',
    })
    async updateResponse(
        @Param('id') id: string,
        @Body() payload: ResponseDisputeDto,
        @I18n() i18n: I18nContext,
    ) {
        return this.disputeResolutionService.responseDispute(id, payload, i18n);
    }

    @Get('/issue-list')
    @ApiOperation({ summary: 'Get a paginated list of dispute issues' })
    @ApiResponse({
        status: 200,
        description: 'List of dispute issues.',
    })
    async getIssueList(
        @Query() query: BasicQueryDto, // Accept JSON as a string
        @I18n() i18: I18nContext,
    ) {
        return this.disputeResolutionService.getDisputeList(query, i18);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get details of a dispute by ID' })
    @ApiParam({ name: 'id', description: 'Dispute ID', type: String })
    @ApiResponse({
        status: 200,
        description: 'Dispute details retrieved successfully.',
    })
    @ApiResponse({
        status: 404,
        description: 'Dispute not found.',
    })
    async getKidById(@Param('id') id: string, @I18n() i18n: I18nContext) {
        return this.disputeResolutionService.getDisputeById(id, i18n);
    }
}
