import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class SuspenDto {
  @ApiProperty({
    description: 'reason',
  })
  @IsString({ message: 'validation.reason.isString' })
  @IsNotEmpty({ message: 'validation.reason.isNotEmpty' })
  reason: string;

  @ApiProperty({
    description: 'reason',
  })
  @IsString({ message: 'validation.reason.isString' })
  @IsNotEmpty({ message: 'validation.reason.isNotEmpty' })
  @IsIn(['active', 'suspended'])
  status: string;
}
