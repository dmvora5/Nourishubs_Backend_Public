// dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email address',
    example: 'userExample@gmail.com',
  })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  @IsNotEmpty({ message: 'validation.email.isNotEmpty' })
  email: string;
}
