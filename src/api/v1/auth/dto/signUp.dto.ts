import { ROLES } from '@app/common';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsEmail,
  MinLength,
  IsIn,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateNested,
  ValidateIf,
  Min,
  Max,
  IsMongoId,
  IsOptional,
} from 'class-validator';

class CommonFieldsDto {
  @ApiProperty({ description: 'First name' })
  @IsString({ message: 'validation.first_name.isString' })
  @IsNotEmpty({ message: 'validation.first_name.isNotEmpty' })
  first_name: string;

  @ApiProperty({ description: 'Last name' })
  @IsString({ message: 'validation.last_name.isString' })
  @IsNotEmpty({ message: 'validation.last_name.isNotEmpty' })
  last_name: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  @IsNotEmpty({ message: 'validation.email.isNotEmpty' })
  email: string;

  @ApiProperty({ description: 'Password (minimum 8 characters)' })
  @IsString({ message: 'validation.password.isString' })
  @IsNotEmpty({ message: 'validation.password.isNotEmpty' })
  @MinLength(8, { message: 'validation.password.minLength' })
  password: string;

  @ApiProperty({ description: 'Confirm password (must match password)' })
  @IsString({ message: 'validation.confirm_password.isString' })
  @IsNotEmpty({ message: 'validation.confirm_password.isNotEmpty' })
  @ValidateIf((o) => o.password === o.confirm_password, {
    message: 'validation.confirm_password.validateIf',
  })
  confirm_password: string;

  @ApiProperty({ description: 'Phone number' })
  @IsPhoneNumber(null, { message: 'validation.phoneNo.isPhoneNumber' })
  @IsString({ message: 'validation.phoneNo.isString' })
  // @IsNotEmpty({ message: 'validation.phoneNo.isNotEmpty' })
  @IsOptional()
  phoneNo?: string;

  @ApiProperty({ description: 'Country ' })
  @IsString({ message: 'validation.country.isString' })
  @IsNotEmpty({ message: 'validation.country.isNotEmpty' })
  country: string;

  @ApiProperty({ description: 'City' })
  @IsString({ message: 'validation.city.isString' })
  @IsNotEmpty({ message: 'validation.city.isNotEmpty' })
  city: string;

  @ApiProperty({ description: 'State' })
  @IsString({ message: 'validation.state.isString' })
  @IsNotEmpty({ message: 'validation.state.isNotEmpty' })
  state: string;

  @ApiProperty({ description: 'District' })
  @IsString({ message: 'validation.district.isString' })
  @IsNotEmpty({ message: 'validation.district.isNotEmpty' })
  district: string;

  @ApiProperty({ description: 'Address' })
  @IsString({ message: 'validation.address.isString' })
  @IsNotEmpty({ message: 'validation.address.isNotEmpty' })
  address: string;

  @ApiProperty({ description: 'Latitude value (must be between -90 and 90)' })
  @IsNumber({}, { message: 'validation.latitude.isNumber' })
  @IsNotEmpty({ message: 'validation.latitude.isNotEmpty' })
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'Longitude value (must be between -180 and 180)',
  })
  @IsNumber({}, { message: 'validation.longitude.isNumber' })
  @IsNotEmpty({ message: 'validation.longitude.isNotEmpty' })
  @Min(-180)
  @Max(180)
  longitude: number;
}

export class SchoolSignUpDto extends CommonFieldsDto {
  @ApiProperty({ description: 'The name of the school', example: 'ABC School' })
  @IsString({ message: 'validation.schoolName.isString' })
  @IsNotEmpty({ message: 'validation.schoolName.isNotEmpty' })
  schoolName: string;

  // @ApiProperty({ description: 'The address of the school', example: '456 Elm Street' })
  // @IsString({ message: 'validation.schoolAddress.isString' })
  // @IsNotEmpty({ message: 'validation.schoolAddress.isNotEmpty' })
  // schoolAddress: string;
}

export class ParentSignUpDto extends CommonFieldsDto {}

export class VendorSignUpDto extends CommonFieldsDto {
  @ApiProperty({
    description: 'The name of the vendor company',
    example: 'Tech Corp',
  })
  @IsString({ message: 'validation.companyName.isString' })
  @IsNotEmpty({ message: 'validation.companyName.isNotEmpty' })
  companyName: string;
}

export class SignUpDto {
  @ApiProperty({
    enum: [ROLES.SCHOOL, ROLES.PARENT, ROLES.VENDOR],
    description: 'Type of user signing up',
  })
  @IsString()
  @IsIn([ROLES.SCHOOL, ROLES.PARENT, ROLES.VENDOR]) // Allowed types
  type: string;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(SchoolSignUpDto) },
      { $ref: getSchemaPath(ParentSignUpDto) },
      { $ref: getSchemaPath(VendorSignUpDto) },
    ],
    description: 'Data object based on the user type',
  })
  @IsDefined()
  @ValidateNested()
  @Type((object) => {
    switch (object?.object?.type) {
      case ROLES.SCHOOL:
        return SchoolSignUpDto;
      case ROLES.PARENT:
        return ParentSignUpDto;
      case ROLES.VENDOR:
        return VendorSignUpDto;
      default:
        return Object;
    }
  })
  data: SchoolSignUpDto | ParentSignUpDto | VendorSignUpDto;
}
