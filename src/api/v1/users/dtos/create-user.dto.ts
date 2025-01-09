import { ROLES } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsMongoId,
  ValidateIf,
} from 'class-validator';

export class UserPermissionDto {
  @ApiProperty({
    description: 'Permission name.',
    example: 'read',
  })
  @IsString({ message: 'validation.permission.isString' })
  @IsNotEmpty({ message: 'validation.permission.notEmpty' })
  permission: string;

  @ApiProperty({
    description: 'List of sub-permissions.',
    type: [String],
    example: ['read-all', 'read-specific'],
  })
  @IsArray({ message: 'validation.subPermissions.isArray' })
  @IsString({ each: true, message: 'validation.subPermissions.each.isString' })
  @IsNotEmpty({ message: 'validation.subPermissions.notEmpty' })
  subPermissions: string[];
}

export class CreateUserDto {
  @ApiProperty({
    description: 'First name of the user.',
    example: 'John',
  })
  @IsString({ message: 'validation.firstName.isString' })
  @IsNotEmpty({ message: 'validation.firstName.notEmpty' })
  first_name: string;

  @ApiProperty({
    description: 'Last name of the user.',
    example: 'Doe',
  })
  @IsString({ message: 'validation.lastName.isString' })
  @IsNotEmpty({ message: 'validation.lastName.notEmpty' })
  last_name: string;

  @ApiProperty({
    description: 'Email of the user.',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  @IsNotEmpty({ message: 'validation.email.notEmpty' })
  email: string;

  @ApiProperty({
    description: 'Role assigned to the user.',
    example: 'admin',
  })
  @IsString({ message: 'validation.role.isString' })
  @IsNotEmpty({ message: 'validation.role.notEmpty' })
  role: string;

  @ApiProperty({
    description: 'List of permissions assigned to the user.',
    type: [UserPermissionDto],
  })
  @IsArray({ message: 'validation.permissions.isArray' })
  @ValidateNested({
    each: true,
    message: 'validation.permissions.each.isObject',
  })
  @Type(() => UserPermissionDto)
  permissions: UserPermissionDto[];

  @ApiProperty({
    description: 'Address of the user.',
    example: '123 Main St',
  })
  @IsString({ message: 'validation.lastName.isString' })
  address: string;

  @ApiProperty({
    description: 'Country of the user.',
    example: 'USA',
  })
  @IsNotEmpty({ message: 'validation.country.notEmpty' })
  @IsString({ message: 'validation.country.isString' })
  country: string;

  @ApiProperty({
    description: 'City of the user.',
    example: 'New York',
  })
  @IsString({ message: 'validation.city.isString' })
  @IsNotEmpty({ message: 'validation.city.notEmpty' })
  city: string;

  @ApiProperty({
    description: 'State of the user.',
    example: 'NY',
  })
  @IsString({ message: 'validation.state.isString' })
  @IsNotEmpty({ message: 'validation.state.notEmpty' })
  state: string;

  @ApiProperty({
    description: 'District of the user.',
    example: 'Manhattan',
  })
  @IsString({ message: 'validation.district.isString' })
  @IsNotEmpty({ message: 'validation.district.notEmpty' })
  district: string;

  @ApiProperty({
    description: "Latitude of the user's location.",
    example: 40.7128,
  })
  @IsNumber({}, { message: 'validation.latitude.isNumber' })
  @IsNotEmpty({ message: 'validation.latitude.notEmpty' })
  latitude: number;

  @ApiProperty({
    description: "Longitude of the user's location.",
    example: -74.006,
  })
  @IsNumber({}, { message: 'validation.longitude.isNumber' })
  @IsNotEmpty({ message: 'validation.longitude.notEmpty' })
  longitude: number;

  @ApiProperty({
    description: 'Phone number of the user.',
    example: '+1234567890',
  })
  @IsString({ message: 'validation.phoneNo.isString' })
  @IsNotEmpty({ message: 'validation.phoneNo.notEmpty' })
  phoneNo: string;

  @ApiProperty({ description: 'The name of the school', example: 'ABC School' })
  @IsString({ message: 'validation.schoolName.isString' })
  @IsNotEmpty({ message: 'validation.schoolName.notEmpty' })
  @ValidateIf((object) => object.role === ROLES.SCHOOL)
  schoolName: string;


  @ApiProperty({ description: 'The id of the school', example: '677e3d939f13fa24b9fe234e' })
  @IsString({ message: 'validation.schoolId.isString' })
  @IsMongoId({ message: 'validation.schoolId.isMongoId' })
  @IsNotEmpty({ message: 'validation.schoolId.notEmpty' })
  @ValidateIf((object) => object.role === ROLES.TEACHER || object.role === ROLES.SCHOOLOTHERS)
  schoolId: string;

}
