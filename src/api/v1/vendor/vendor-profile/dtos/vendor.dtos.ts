import { CustomTimeValidator } from '@app/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  Validate,
  IsArray,
  IsNumber,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,

  IsPhoneNumber,
} from 'class-validator';
import { DaysOfWeek } from 'src/api/v1/users/models/user.schema';

const timeFormat = /^([01]?[0-9]|2[0-3]):([0-5][0-9])\s?(AM|PM)$/;
// const timeFormat24 = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export class OpeningClosingTimeDTO {
  @ApiProperty({
    description: 'Opening time in HH:mm format',
    example: '09:00',
  })
  @IsString({ message: 'validation.openingTime.isString' })
  @Matches(timeFormat, { message: 'validation.openingTime.matches' })
  openingTime: string;

  @ApiProperty({
    description: 'Closing time in HH:mm format',
    example: '18:00',
  })
  @IsString({ message: 'validation.closingTime.isString' })
  @Matches(timeFormat, { message: 'validation.closingTime.matches' })
  closingTime: string;

  @Validate(CustomTimeValidator, {
    message: 'Closing time must be later than opening time.',
  })
  validateTimes(): { openingTime: string; closingTime: string } {
    return { openingTime: this.openingTime, closingTime: this.closingTime };
  }
}

export class LocationDTO {
  @ApiProperty({
    description: 'Country of the location',
    example: 'United States',
  })
  @IsNotEmpty({ message: 'validation.country.notEmpty' })
  @IsString({ message: 'validation.country.isString' })
  country: string;

  @ApiProperty({
    description: 'City of the location',
    example: 'New York',
  })
  @IsString({ message: 'validation.city.isString' })
  @IsNotEmpty({ message: 'validation.city.notEmpty' })
  city: string;

  @ApiProperty({
    description: 'State of the location',
    example: 'New York',
  })
  @IsString({ message: 'validation.state.isString' })
  @IsNotEmpty({ message: 'validation.state.notEmpty' })
  state: string;

  @ApiProperty({
    description: 'District of the location',
    example: 'Manhattan',
  })
  @IsString({ message: 'validation.district.isString' })
  @IsNotEmpty({ message: 'validation.district.notEmpty' })
  district: string;

  @ApiProperty({
    description: 'Latitude of the location',
    example: 40.7128,
  })
  @IsNumber({}, { message: 'validation.latitude.isNumber' })
  @IsNotEmpty({ message: 'validation.latitude.notEmpty' })
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the location',
    example: -74.006,
  })
  @IsNumber({}, { message: 'validation.longitude.isNumber' })
  @IsNotEmpty({ message: 'validation.longitude.notEmpty' })
  longitude: number;

  @ApiProperty({
    description: 'Address of the location',
    example: '123 Main St',
  })
  @IsString({ message: 'validation.address.isString' })
  @IsNotEmpty({ message: 'validation.address.notEmpty' })
  address: string;

  @ApiProperty({
    description: 'Coordinates as [longitude, latitude]',
    example: [-74.006, 40.7128],
  })
  @IsArray({ message: 'validation.coordinates.isArray' })
  @ArrayMinSize(2, {
    message: 'validation.coordinates.min',
  })
  @ArrayMaxSize(2, {
    message: 'validation.coordinates.max',
  })
  @IsNumber(
    {},
    { each: true, message: 'Each element in coordinates must be a number.' },
  )
  coordinates: number[];
}

export class VenueDTO {
  @ApiPropertyOptional({
    description: 'Location details',
    type: LocationDTO,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LocationDTO)
  location: LocationDTO;

  @ApiPropertyOptional({
    description: 'Opening and closing times mapped to days of the week',
    type: Object, // Swagger cannot infer Map types well
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OpeningClosingTimeDTO)
  openingTimes: Map<DaysOfWeek, OpeningClosingTimeDTO>;
}

export class UpdateVendorDto {
  @ApiProperty({ description: 'First name of the vendor', example: 'John' })
  @IsString({ message: 'validation.firstName.isString' })
  @IsNotEmpty({ message: 'validation.firstName.notEmpty' })
  first_name: string;

  @ApiProperty({ description: 'Last name of the vendor', example: 'Doe' })
  @IsString({ message: 'validation.lastName.isString' })
  @IsNotEmpty({ message: 'validation.lastName.notEmpty' })
  last_name: string;

  @ApiProperty({
    description: 'Email of the vendor',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  @IsNotEmpty({ message: 'validation.email.notEmpty' })
  email: string;

  @ApiProperty({
    description: 'Phone number of the vendor',
    example: '+1234567890',
  })
  @IsString({ message: 'validation.phoneNo.isString' })
  @IsNotEmpty({ message: 'validation.phoneNo.notEmpty' })
  @IsPhoneNumber(null, { message: 'validation.phoneNo.isPhoneNumber' })
  phoneNo: string;

  @ApiProperty({
    description: 'Company name of the vendor',
    example: 'Vendor Inc.',
  })
  @IsString({ message: 'validation.companyName.isString' })
  @IsNotEmpty({ message: 'validation.companyName.notEmpty' })
  companyName: string;

  @ApiProperty({
    description: 'Description of the vendor',
    example: 'We sell amazing products.',
  })
  @IsString({ message: 'validation.description.isString' })
  @IsNotEmpty({ message: 'validation.description.notEmpty' })
  description: string;

  @ApiPropertyOptional({
    description: 'List of venues',
    type: [VenueDTO],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VenueDTO)
  venues?: VenueDTO[];

  @ApiProperty({
    description: 'Country of the vendor',
    example: 'United States',
  })
  @IsNotEmpty({ message: 'validation.country.notEmpty' })
  @IsString({ message: 'validation.country.isString' })
  country: string;

  @ApiProperty({ description: 'City of the vendor', example: 'New York' })
  @IsString({ message: 'validation.city.isString' })
  @IsNotEmpty({ message: 'validation.city.notEmpty' })
  city: string;

  @ApiProperty({ description: 'State of the vendor', example: 'New York' })
  @IsString({ message: 'validation.state.isString' })
  @IsNotEmpty({ message: 'validation.state.notEmpty' })
  state: string;

  @ApiProperty({ description: 'District of the vendor', example: 'Manhattan' })
  @IsString({ message: 'validation.district.isString' })
  @IsNotEmpty({ message: 'validation.district.notEmpty' })
  district: string;

  @ApiProperty({
    description: 'Latitude of the vendor address',
    example: 40.7128,
  })
  @IsNumber({}, { message: 'validation.latitude.isNumber' })
  @IsNotEmpty({ message: 'validation.latitude.notEmpty' })
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the vendor address',
    example: -74.006,
  })
  @IsNumber({}, { message: 'validation.longitude.isNumber' })
  @IsNotEmpty({ message: 'validation.longitude.notEmpty' })
  longitude: number;

  @ApiProperty({
    description: 'Full address of the vendor',
    example: '123 Main St',
  })
  @IsString({ message: 'validation.address.isString' })
  @IsNotEmpty({ message: 'validation.address.notEmpty' })
  address: string;
}


export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}