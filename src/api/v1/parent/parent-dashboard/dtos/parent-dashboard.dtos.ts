import { IsDateString, IsOptional } from 'class-validator';

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AvalebleVendors {
  @ApiProperty({
    description: 'Start date for vendor availability',
    example: '2024-12-01T00:00:00Z'
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: 'End date for vendor availability',
    example: '2024-12-31T23:59:59Z'
  })
  @IsDateString()
  endDate: Date;
}

export class UpdateParentDto {

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  file?: Express.Multer.File

  @ApiProperty({
    description: 'First name of the parent',
    example: 'John'
  })
  @IsString({ message: 'validation.firstName.isString' })
  @IsNotEmpty({ message: 'validation.firstName.notEmpty' })
  first_name: string;

  @ApiProperty({
    description: 'Last name of the parent',
    example: 'Doe'
  })
  @IsString({ message: 'validation.lastName.isString' })
  @IsNotEmpty({ message: 'validation.lastName.notEmpty' })
  last_name: string;

  @ApiProperty({
    description: 'Email address of the parent',
    example: 'johndoe@example.com'
  })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  @IsNotEmpty({ message: 'validation.email.notEmpty' })
  email: string;

  @ApiProperty({
    description: 'Gender of the parent',
    example: 'Male'
  })
  @IsString({ message: 'validation.gender.isString' })
  @IsNotEmpty({ message: 'validation.gender.notEmpty' })
  gender: string;

  @ApiProperty({
    description: 'Phone number of the parent',
    example: '+1234567890'
  })
  @IsString({ message: 'validation.phoneNo.isString' })
  @IsNotEmpty({ message: 'validation.phoneNo.notEmpty' })
  @IsPhoneNumber(null, { message: 'validation.phoneNo.isPhoneNumber' })
  phoneNo: string;

  @ApiProperty({
    description: 'Latitude of the parent\'s location',
    example: 37.7749
  })
  @IsNotEmpty({ message: 'validation.latitude.notEmpty' })
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the parent\'s location',
    example: -122.4194
  })
  @IsNotEmpty({ message: 'validation.longitude.notEmpty' })
  longitude: number;

  @ApiProperty({
    description: 'Address of the parent',
    example: '123 Main St, Springfield'
  })
  @IsString({ message: 'validation.address.isString' })
  @IsNotEmpty({ message: 'validation.address.notEmpty' })
  address: string;

  @ApiProperty({
    description: 'Country of residence',
    example: 'United States'
  })
  @IsNotEmpty({ message: 'validation.country.notEmpty' })
  @IsString({ message: 'validation.country.isString' })
  country: string;

  @ApiProperty({
    description: 'City of residence',
    example: 'San Francisco'
  })
  @IsString({ message: 'validation.city.isString' })
  @IsNotEmpty({ message: 'validation.city.notEmpty' })
  city: string;

  @ApiProperty({
    description: 'State of residence',
    example: 'California'
  })
  @IsString({ message: 'validation.state.isString' })
  @IsNotEmpty({ message: 'validation.state.notEmpty' })
  state: string;

  @ApiProperty({
    description: 'District of residence',
    example: 'District 1'
  })
  @IsString({ message: 'validation.district.isString' })
  @IsNotEmpty({ message: 'validation.district.notEmpty' })
  district: string;
}
