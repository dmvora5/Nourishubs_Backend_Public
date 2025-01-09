import { Controller, Get } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiTags } from '@nestjs/swagger';


@Controller('countries')
@ApiTags('Countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async getCountries(
    @I18n() i18n: I18nContext
  ) {
    return this.countriesService.getCountries(i18n)
  }
}
