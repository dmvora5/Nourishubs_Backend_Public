import { Exclude, Expose, Type } from 'class-transformer';

class CountryResponseDto {
  @Expose()
  name: string;

  @Expose()
  code: string;
}

export class QueryResponseDto {
  @Expose()
  _id: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  email: string;

  @Expose()
  phoneNo: string;

  @Expose()
  message: string;

  @Expose()
  role: string;

  @Expose()
  @Type(() => CountryResponseDto)
  countryId: CountryResponseDto;
}
