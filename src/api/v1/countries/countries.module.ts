import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { CountryRepository } from './countries.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from './models/country.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Country.name, schema: CountrySchema }
    ]),
  ],
  controllers: [CountriesController],
  providers: [CountriesService, CountryRepository],
  exports: [CountriesService, CountryRepository],
})
export class CountriesModule { }
