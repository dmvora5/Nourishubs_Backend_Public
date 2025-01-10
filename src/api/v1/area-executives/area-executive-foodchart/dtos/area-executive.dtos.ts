import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  Validate,
  ValidateNested,
} from 'class-validator';
import { NoRecurringDayConflict, VenderDayDto } from 'src/modules/foodchart/dtos/food-charts-dtos';

export class CreateFoodChartsWithOrthorityeDto {
  @ApiProperty({
    description: 'Food chart details',
    example: 'detais',
    required: false,
  })
  @IsOptional()
  details?: string;

  @ApiProperty({
    description: 'School admin id',
    example: '64cfd9f4b20b2a3d4e123456',
  })
  schoolAdminId: string;
  @ApiProperty({
    description: 'Array of vendor day details',
    example: [
      {
        date: '2024-12-27',
        isDelete: false,
        vendorId: '64cfd9f4b20b2a3d4e123456',
      },
    ],
  })
  @ValidateNested({ each: true }) // Validate each event
  @Type(() => VenderDayDto)
  @Validate(NoRecurringDayConflict) // Apply the custom validator
  @ArrayNotEmpty({ message: 'validation.vendor.notEmpty' })
  @IsArray({ message: 'validation.vendor.isArray' })
  vendors: VenderDayDto[];
}

