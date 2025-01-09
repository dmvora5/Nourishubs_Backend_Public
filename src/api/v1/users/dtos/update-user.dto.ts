// dto/create-user.dto.ts
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserPermissionDto } from './create-user.dto';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'First name of the user',
    type: String,
    example: 'John',
  })
  @IsString({ message: 'validation.firstName.isString' })
  @IsOptional()
  first_name: string;

  @ApiPropertyOptional({
    description: 'Last name of the user',
    type: String,
    example: 'Doe',
  })
  @IsString({ message: 'validation.lastName.isString' })
  @IsOptional()
  last_name: string;

  @ApiPropertyOptional({
    description: 'Email address of the user',
    type: String,
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  @IsOptional()
  email: string;

  // @ApiPropertyOptional({
  //   description: 'Role of the user',
  //   type: String,
  //   example: 'admin',
  // })
  // @IsString({ message: 'validation.role.isString' })
  // @IsOptional()
  // role: string;

  @ApiPropertyOptional({
    description: 'Permissions of the user',
    type: [UserPermissionDto],
    example: [
      { _id: 'permissionId1', name: 'Permission Name 1' },
      { _id: 'permissionId2', name: 'Permission Name 2' },
    ],
  })
  @IsArray({ message: 'validation.permissions.isArray' })
  @ValidateNested({
    each: true,
    message: 'validation.permissions.each.isObject',
  })
  @Type(() => UserPermissionDto)
  permissions: UserPermissionDto[];

  @ApiPropertyOptional({
    description: 'Address of the user',
    type: String,
    example: '123 Main Street',
  })
  @IsString({ message: 'validation.lastName.isString' })
  @IsOptional()
  address: string;

  @ApiProperty({
    description: 'Country of the user',
    type: String,
    example: 'United States',
  })
  @IsNotEmpty({ message: 'validation.country.notEmpty' })
  @IsString({ message: 'validation.country.isString' })
  country: string;

  @ApiProperty({
    description: 'City of the user',
    type: String,
    example: 'New York',
  })
  @IsString({ message: 'validation.city.isString' })
  @IsNotEmpty({ message: 'validation.city.notEmpty' })
  city: string;

  @ApiProperty({
    description: 'State of the user',
    type: String,
    example: 'New York',
  })
  @IsString({ message: 'validation.state.isString' })
  @IsNotEmpty({ message: 'validation.state.notEmpty' })
  state: string;

  @ApiProperty({
    description: 'District of the user',
    type: String,
    example: 'Manhattan',
  })
  @IsString({ message: 'validation.district.isString' })
  @IsNotEmpty({ message: 'validation.district.notEmpty' })
  district: string;

  @ApiProperty({
    description: 'Latitude of the user location',
    type: Number,
    example: 40.7128,
  })
  @IsNumber({}, { message: 'validation.latitude.isNumber' })
  @IsNotEmpty({ message: 'validation.latitude.notEmpty' })
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the user location',
    type: Number,
    example: -74.006,
  })
  @IsNumber({}, { message: 'validation.longitude.isNumber' })
  @IsNotEmpty({ message: 'validation.longitude.notEmpty' })
  longitude: number;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
    type: String,
    example: '+1 123 456 7890',
  })
  @IsString({ message: 'validation.phoneNo.isString' })
  @IsOptional()
  phoneNo: string;
}
