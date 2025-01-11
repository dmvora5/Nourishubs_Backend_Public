import { BasicQueryDto } from '@app/common';
import {
  IsBoolean,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class SchoolQueryDto extends BasicQueryDto {
  @IsOptional()
  @IsMongoId({ message: 'validation.schoolId.isMongoId' })
  schoolId?: string;
}
