import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFoodCategoryDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;

  @ApiProperty({
    description: 'Name of the food category',
    example: 'Beverages',
  })
  @IsNotEmpty({ message: 'validation.name.notEmpty' })
  @IsString({ message: 'validation.name.isString' })
  name: string;
}

export class UpdateFoodCategoryDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary', required: true })
  @IsOptional()
  file: Express.Multer.File;

  @ApiProperty({
    description: 'Name of the food category',
    example: 'Beverages',
  })
  @IsNotEmpty({ message: 'validation.name.notEmpty' })
  @IsString({ message: 'validation.name.isString' })
  name: string;
}
