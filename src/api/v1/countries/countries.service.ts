import { Serialize } from '@app/common';
import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { CountryRepository } from './countries.repository';
import { CountryResponseDto } from './dtos/country.response.dto';
import { CommonResponseService } from '@app/common/services';

@Injectable()
export class CountriesService {
  constructor(
    private readonly countryRepository: CountryRepository,
    private readonly responseService: CommonResponseService,
  ) {}

  async getCountries(i18n: I18nContext) {
    try {
      const countries = await this.countryRepository.find({});
      const result = {
        countries: Serialize(CountryResponseDto, countries),
      };
      return this.responseService.success(
        await i18n.translate('messages.countryRetrieved'),
        result,
        {},
      );
    } catch (error) {
      throw error;
    }
  }
}
