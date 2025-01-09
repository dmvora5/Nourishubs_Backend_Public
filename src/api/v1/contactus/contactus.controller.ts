import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ContactusService } from './contactus.service';
import { BasicQueryDto, Validate } from '@app/common';
import { CreateContactusDto } from './dto/create-contactus.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';

@Controller('contactus')
export class ContactusController {
  constructor(private readonly contactusService: ContactusService) {}

  @Post()
  @Validate()
  create(@Body() createContactusDto: CreateContactusDto, @I18n() i18n: I18nContext) {
    return this.contactusService.create(createContactusDto, i18n);
  }

  @Get()
  @ApiQuery({name: 'page',description: 'pagenumber', required: false, example: 1})
  @ApiQuery({name: 'limit',description: 'records per page', required: false, example: 10})
  @ApiQuery({name: 'searchQuery',description: 'SearchQuery', required: false})
  findAll(
    @Query() query: BasicQueryDto,
    @I18n() i18n: I18nContext
  ) {
    return this.contactusService.findAll(query, i18n);
  }
}
