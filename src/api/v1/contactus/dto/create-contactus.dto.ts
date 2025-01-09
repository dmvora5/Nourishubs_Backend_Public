import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsMongoId,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactusDto {
  @ApiProperty({
    description: 'The first name of the contact person',
    example: 'John',
  })
  @IsString({ message: 'validation.firstName.isString' })
  @IsNotEmpty({ message: 'validation.firstName.notEmpty' })
  first_name: string;

  @ApiProperty({
    description: 'The last name of the contact person',
    example: 'Doe',
  })
  @IsString({ message: 'validation.lastName.isString' })
  @IsNotEmpty({ message: 'validation.lastName.notEmpty' })
  last_name: string;

  @ApiProperty({
    description: 'The email address of the contact person',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  @IsString({ message: 'validation.email.isString' })
  @IsNotEmpty({ message: 'validation.email.notEmpty' })
  email: string;

  @ApiPropertyOptional({
    description: 'The phone number of the contact person (optional)',
    example: '+123456789',
  })
  @IsOptional()
  @IsString({ message: 'validation.phoneNo.isString' })
  phoneNo?: string | null;

  @ApiProperty({
    description: 'The message provided by the contact person',
    example: 'I would like more information about your services.',
  })
  @IsString({ message: 'validation.message.isString' })
  @IsNotEmpty({ message: 'validation.message.notEmpty' })
  message: string;

  @ApiProperty({
    description: 'The role of the contact person',
    example: 'Customer',
  })
  @IsString({ message: 'validation.role.isString' })
  @IsNotEmpty({ message: 'validation.role.notEmpty' })
  role: string;

  @ApiProperty({
    description: 'The ID of the country associated with the contact person',
    example: '60c72b2f9b1e8a001c8e4b2d',
  })
  @IsMongoId({ message: 'validation.countryId.isMongoId' })
  @IsDefined({ message: 'validation.countryId.isDefined' })
  countryId: string; // References the countries table
}
