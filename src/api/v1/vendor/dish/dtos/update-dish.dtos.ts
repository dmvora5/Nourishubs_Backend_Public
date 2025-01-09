import {
  IsArray,
  IsMongoId,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class IngredientDto {
  @ApiPropertyOptional({
    description: 'Name of the ingredient',
    example: 'Tomato',
  })
  @IsOptional()
  @IsString({ message: 'validation.name.isString' })
  name: string;

  @ApiPropertyOptional({
    description: 'Quantity of the ingredient',
    example: 3,
  })
  @IsOptional()
  @IsNumber({}, { message: 'validation.quantity.isNumber' })
  quantity: number;

  @ApiPropertyOptional({
    description: 'Unit of the ingredient (e.g., grams, liters, etc.)',
    example: 'grams',
  })
  @IsOptional()
  @IsString({ message: 'validation.unit.isString' })
  unit: string;
}

export class UpdateDishDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary', required: true })
  @IsOptional()
  file: Express.Multer.File;

  @ApiPropertyOptional({
    description: 'Vendor ID referencing the vendors table',
    example: '60c72b2f4f1a4e1a1c8b4567',
  })
  @IsOptional()
  @IsMongoId({ message: 'validation.vendor.isMongoId' })
  @IsDefined({ message: 'validation.vendor.isDefined' })
  vendor: string;

  @ApiPropertyOptional({
    description: 'Name of the dish',
    example: 'Spaghetti Bolognese',
  })
  @IsOptional()
  @IsString({ message: 'validation.name.isString' })
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the dish',
    example: 'A classic Italian pasta dish with a rich meat sauce.',
  })
  @IsOptional()
  @IsString({ message: 'validation.description.isString' })
  description: string;

  @ApiPropertyOptional({
    description: 'Array of category IDs for the dish',
    example: ['60c72b2f4f1a4e1a1c8b4568', '60c72b2f4f1a4e1a1c8b4569'],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({
    description: 'Array of modifier IDs for the dish',
    example: ['60c72b2f4f1a4e1a1c8b4570'],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  modifierIds?: string[];

  @ApiPropertyOptional({
    description: 'Pricing of the dish',
    example: 14.99,
  })
  @IsOptional()
  @IsNumber({}, { message: 'validation.price.isNumber' })
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  pricing: number;

  @ApiPropertyOptional({
    description: 'Tax-inclusive pricing of the dish',
    example: 12.99,
  })
  @IsOptional()
  @IsNumber({}, { message: 'validation.tax_pricing.isNumber' })
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  tax_pricing: number;

  @ApiPropertyOptional({
    description: 'Image URL for the dish',
    example: 'https://example.com/dish-image.jpg',
  })
  @IsOptional()
  @IsString({ message: 'validation.image.isString' })
  image?: string;

  @ApiPropertyOptional({
    description: 'Indicates if the dish is a modifier dish',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true) // Transform to boolean
  is_modifier_dish: boolean = false; // Default value set to false

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
  @IsBoolean()
  is_available?: boolean;
}
