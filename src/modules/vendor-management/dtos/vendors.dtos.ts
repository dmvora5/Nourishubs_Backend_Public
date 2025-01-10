import { BasicQueryDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SuspenVendorDto {
  @ApiProperty({
    example: 'Violation of terms and conditions',
    description: 'Reason for suspending the vendor',
  })
  @IsString({ message: 'validation.reason.isString' })
  @IsNotEmpty({ message: 'validation.reason.isNotEmpty' })
  reason: string;
}

