// dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class VerifyUserDto {
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
}
