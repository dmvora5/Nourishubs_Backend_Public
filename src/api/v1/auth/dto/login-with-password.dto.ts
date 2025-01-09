// dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
  IsArray,
} from 'class-validator';

export class LoginWithPassword {
  @ApiProperty({
    description: 'Email of the user',
    example: 'admin@nourishubs.com',
  })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  @IsNotEmpty({ message: 'validation.email.isNotEmpty' })
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'admin@123' })
  @IsString({ message: 'validation.password.isString' })
  @IsNotEmpty({ message: 'validation.password.isNotEmpty' })
  @MinLength(8, { message: 'validation.password.minLength' })
  password: string;
}
