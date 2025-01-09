import {
  IsArray,
  IsInt,
  IsMongoId,
  ValidateNested,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ModifierDto {
  @ApiProperty({
    description: 'Modifier ID as ObjectId to match schema',
    example: '64b2fae5b16c2b1a58f4d8e9',
  })
  @IsMongoId({ message: 'validation.modifierId.isMongoId' })
  @IsNotEmpty({ message: 'validation.modifierId.isNotEmpty' })
  modifierId: Types.ObjectId; // Modifier ID as ObjectId to match schema

  @ApiProperty({
    description: 'Dish ID associated with the modifier',
    example: '64b2fae5b16c2b1a58f4d8e9',
  })
  @IsMongoId({ message: 'validation.dishId.isMongoId' })
  @IsNotEmpty({ message: 'validation.dishId.isNotEmpty' })
  dishId: Types.ObjectId;

  @ApiProperty({
    description: 'Price of the modifier',
    example: 5.99,
  })
  @IsNumber({}, { message: 'validation.price.isNumber' })
  @Min(0, { message: 'validation.price.min' })
  price: number; // Price of the modifier

  @ApiProperty({
    description: 'Quantity of the modifier (optional, default to 1)',
    example: 2,
    required: false,
  })
  @IsInt()
  @Min(1, { message: 'validation.quantity.min' })
  @IsOptional()
  quantity?: number; // Quantity of the modifier (optional, default to 1)
}

export class CreateCartItemDto {
  @ApiProperty({
    description: 'Dish ID to add to the cart',
    example: '64b2fae5b16c2b1a58f4d8e9',
  })
  @IsMongoId({ message: 'validation.dishId.isMongoId' })
  @IsNotEmpty({ message: 'validation.dishId.isNotEmpty' })
  dishId: Types.ObjectId;

  @ApiProperty({
    description: 'Quantity of the dish to add to the cart',
    example: 3,
  })
  @IsInt()
  @Min(1, { message: 'validation.quantity.min' })
  quantity: number;

  @ApiProperty({
    description: 'Price of the dish',
    example: 15.99,
  })
  @IsNumber({}, { message: 'validation.price.isNumber' })
  @Min(0, { message: 'validation.price.min' })
  price: number;

  @ApiProperty({
    description: 'Optional notes for the dish',
    example: 'No onions, extra spicy',
    required: false,
  })
  @IsString({ message: 'validation.notes.isString' })
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Array of modifiers for the dish',
    example: [
      {
        modifierId: '64b2fae5b16c2b1a58f4d8e9',
        dishId: '64b2fae5b16c2b1a58f4d8e9',
        price: 2.5,
        quantity: 1,
      },
    ],
    required: false,
  })
  @IsArray({ message: 'validation.modifiers.isArray' })
  @ValidateNested({ each: true }) // Validates each item in the array
  @Type(() => ModifierDto) // Transforms plain objects into ModifierDto instances
  @IsOptional()
  modifiers?: ModifierDto[]; // Array of modifiers
}
