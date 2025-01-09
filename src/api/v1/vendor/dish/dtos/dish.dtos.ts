import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsMongoId,
  IsDefined,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class IngredientDto {
  @ApiPropertyOptional({
    description: 'Name of the ingredient',
    example: 'Salt',
  })
  @IsOptional()
  @IsString({ message: 'validation.name.isString' })
  name: string;

  @ApiPropertyOptional({
    description: 'Quantity of the ingredient',
    example: 2,
  })
  @IsOptional()
  @IsNumber({}, { message: 'validation.quantity.isNumber' })
  quantity: number;

  @ApiPropertyOptional({
    description: 'Unit of measurement for the ingredient',
    example: 'grams',
  })
  @IsOptional()
  @IsString({ message: 'validation.unit.isString' })
  unit: string;
}

export class DishDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;

  @ApiProperty({
    description: 'Vendor ID referencing the vendors table',
    example: '60c72b2f4f1a4e1a1c8b4567',
  })
  @IsOptional()
  @IsMongoId({ message: 'validation.vendor.isMongoId' })
  @IsDefined({ message: 'validation.vendor.isDefined' })
  vendor: string;

  @ApiProperty({ description: 'Name of the dish', example: 'Pasta' })
  @IsNotEmpty({ message: 'validation.name.notEmpty' })
  @IsString({ message: 'validation.name.isString' })
  name: string;

  @ApiProperty({
    description: 'Description of the dish',
    example: 'Delicious pasta with tomato sauce',
  })
  @IsNotEmpty({ message: 'validation.description.notEmpty' })
  @IsString({ message: 'validation.description.isString' })
  description: string;

  @ApiPropertyOptional({
    description: 'Array of category IDs for the dish',
    example: ['60c72b2f4f1a4e1a1c8b4568', '60c72b2f4f1a4e1a1c8b4569'],
  })
  @IsOptional()
  @IsArray({ message: 'validation.categoryIds.isArray' })
  @IsMongoId({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({
    description: 'Array of modifier IDs for the dish',
    example: ['60c72b2f4f1a4e1a1c8b4570'],
  })
  @IsOptional()
  @IsArray({ message: 'validation.modifierIds.isArray' })
  @IsMongoId({ each: true })
  modifierIds?: string[];

  @ApiProperty({ description: 'Pricing of the dish', example: 10.99 })
  @IsNotEmpty({ message: 'validation.price.notEmpty' })
  @IsNumber({}, { message: 'validation.price.isNumber' })
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  pricing: number;

  @ApiProperty({
    description: 'Tax-inclusive pricing of the dish',
    example: 12.99,
  })
  @IsNotEmpty({ message: 'validation.tax_pricing.notEmpty' })
  @IsNumber({}, { message: 'validation.tax_pricing.notEmpty' })
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  tax_pricing: number;

  @ApiPropertyOptional({
    description: 'Indicates if the dish is a modifier dish',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true) // Transform to boolean
  is_modifier_dish?: boolean = false;

  @ApiPropertyOptional({
    description: 'List of ingredients for the dish',
    type: [IngredientDto],
  })
  @IsOptional()
  @IsArray({ message: 'validation.ingredients.isArray' })
  ingredients?: IngredientDto[];

  @ApiPropertyOptional({
    description: 'Indicates if the dish is available',
    example: true,
  })
  @IsOptional()
  is_available?: boolean;
}
