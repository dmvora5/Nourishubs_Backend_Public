// dto/create-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class NewPasswordDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  @IsNotEmpty({ message: 'validation.email.isNotEmpty' })
  email: string;

  @ApiProperty({
    description: 'One-time password (OTP) sent to the user',
    example: 123456,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'validation.otp.isNumber' })
  @IsNotEmpty({ message: 'validation.otp.isNotEmpty' })
  otp: number;

  @ApiProperty({
    description: 'New password for the user',
    example: 'SecurePassword123',
    minLength: 8,
  })
  @IsString({ message: 'validation.newPassword.isString' })
  @IsNotEmpty({ message: 'validation.newPassword.isNotEmpty' })
  @MinLength(8, { message: 'validation.newPassword.minLength' })
  newPassword: string; // Changed to string to match typical password requirements
}
