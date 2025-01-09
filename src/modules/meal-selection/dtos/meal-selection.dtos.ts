import { IsDateString, IsMongoId, IsOptional } from 'class-validator';

import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AvalebleVendors {

  @ApiProperty({
    description: 'Start date for available vendors',
    example: '2024-12-27T00:00:00Z',
  })
  @IsDateString({}, { message: 'validation.startDate.dateString' })
  startDate: Date;

  @ApiProperty({
    description: 'End date for available vendors',
    example: '2024-12-28T23:59:59Z',
  })
  @IsDateString({}, { message: 'validation.endDate.dateString' })
  endDate: Date;
}

export class UpdateParentDto {
  @ApiProperty({
    description: 'First name of the parent',
    example: 'John',
  })
  @IsString({ message: 'validation.firstName.isString' })
  @IsNotEmpty({ message: 'validation.firstName.notEmpty' })
  first_name: string;

  @ApiProperty({
    description: 'Last name of the parent',
    example: 'Doe',
  })
  @IsString({ message: 'validation.lastName.isString' })
  @IsNotEmpty({ message: 'validation.lastName.notEmpty' })
  last_name: string;

  @ApiProperty({
    description: 'Name of the school',
    example: 'Springfield Elementary',
  })
  @IsString({ message: 'validation.schoolName.isString' })
  @IsNotEmpty({ message: 'validation.schoolName.notEmpty' })
  schoolName: string;

  @ApiProperty({
    description: 'Email address of the parent',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  @IsNotEmpty({ message: 'validation.email.notEmpty' })
  email: string;

  @ApiProperty({
    description: 'Age of the parent',
    example: 35,
  })
  @IsNumber({}, { message: 'validation.age.isNumber' })
  @IsNotEmpty({ message: 'validation.age.notEmpty' })
  age: number;

  @ApiProperty({
    description: 'Gender of the parent',
    example: 'Male',
  })
  @IsString({ message: 'validation.gender.isString' })
  @IsNotEmpty({ message: 'validation.gender.notEmpty' })
  gender: string;

  @ApiProperty({
    description: 'Phone number of the parent',
    example: '+1234567890',
  })
  @IsString({ message: 'validation.phoneNo.isString' })
  @IsNotEmpty({ message: 'validation.phoneNo.notEmpty' })
  @IsPhoneNumber(null, { message: 'validation.phoneNo.isPhoneNumber' })
  phoneNo: string;

  @ApiProperty({
    description: 'Latitude coordinate of the parent’s location',
    example: 40.7128,
  })
  @IsNumber({}, { message: 'validation.latitude.isNumber' })
  @IsNotEmpty({ message: 'validation.latitude.notEmpty' })
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate of the parent’s location',
    example: -74.0060,
  })
  @IsNumber({}, { message: 'validation.longitude.isNumber' })
  @IsNotEmpty({ message: 'validation.longitude.notEmpty' })
  longitude: number;

  @ApiProperty({
    description: 'Address of the parent',
    example: '742 Evergreen Terrace, Springfield',
  })
  @IsString({ message: 'validation.address.isString' })
  @IsNotEmpty({ message: 'validation.address.notEmpty' })
  address: string;
}


export class AvalebleVendorsForKid extends AvalebleVendors {
  @ApiProperty({
    description: 'Kid ID associated with the cart',
    example: '64b2fae5b16c2b1a58f4d8e9',
    required: false,
  })
  @IsMongoId({ message: 'validation.kidId.isMongoId' })
  @IsNotEmpty({ message: 'validation.kidId.isNotEmpty' })
  kidId: string;
}