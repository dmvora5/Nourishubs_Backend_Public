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
}

class CartItemDto {
  @ApiProperty({
    description: 'Dish ID to add to the cart',
    example: '64b2fae5b16c2b1a58f4d8e9',
  })
  @IsMongoId({ message: 'validation.dishId.isMongoId' })
  @IsNotEmpty({ message: 'validation.dishId.isNotEmpty' })
  dishId: Types.ObjectId;

  @ApiProperty({
    description: 'Quantity of the dish',
    example: 3,
  })
  @IsNumber()
  @Min(1, { message: 'validation.quantity.min' })
  quantity: number;

  @ApiProperty({
    description: 'Optional notes for the dish',
    example: 'Extra cheese, no olives',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'validation.notes.isString' })
  notes?: string;

  @ApiProperty({
    description: 'Array of modifiers for the dish',
    example: [
      {
        modifierId: '64b2fae5b16c2b1a58f4d8e9',
        dishId: '64b2fae5b16c2b1a58f4d8e9',
      },
    ],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true }) // Validates each item in the array
  @Type(() => ModifierDto) // Transforms plain objects into ModifierDto instances
  @IsOptional()
  modifiers?: ModifierDto[]; // Array of modifiers
}

export class CreateOrderFromAuthority {
  @ApiProperty({
    description: 'vendorId',
    example: '64b2fae5b16c2b1a58f4d8e9',
  })
  @IsMongoId({ message: 'validation.vendorId.isMongoId' })
  @IsNotEmpty({ message: 'validation.vendorId.isNotEmpty' })
  vendorId: Types.ObjectId;

  @ApiProperty({
    description: 'orderId',
    example: '64b2fae5b16c2b1a58f4d8e9',
  })
  @IsMongoId({ message: 'validation.orderId.isMongoId' })
  @IsNotEmpty({ message: 'validation.orderId.isNotEmpty' })
  orderId: Types.ObjectId;

    @ApiProperty({
      description: 'Array of cart items',
      example: [
        {
          dishId: '64b2fae5b16c2b1a58f4d8e9',
          quantity: 2,
          notes: 'No onions',
          modifiers: [
            {
              modifierId: '64b2fae5b16c2b1a58f4d8e9',
              dishId: '64b2fae5b16c2b1a58f4d8e9',
            },
          ],
        },
      ],
    })
    @IsArray()
    @IsNotEmpty({ message: 'validation.cartItems.isNotEmpty' })
    @ValidateNested({ each: true }) // Validate each item in cartItems
    @Type(() => CartItemDto) // Transforms plain objects into CartItemDto instances
    cartItems: CartItemDto[];

}
