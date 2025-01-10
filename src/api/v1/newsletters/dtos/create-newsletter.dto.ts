import { IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsLetterDto {
  @ApiProperty({
    description: 'Email address of the user subscribing to the newsletter',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'validation.email.isEmail' })
  @IsNotEmpty({ message: 'validation.email.notEmpty' })
  email: string;

  @ApiProperty({
    description: 'Indicates if the user is subscribed to the newsletter',
    example: true,
    default: true,
  })
  @IsBoolean()
  isSubscribed: boolean = true;
}
