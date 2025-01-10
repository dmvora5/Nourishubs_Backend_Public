import {
  IsArray,
  IsBoolean,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

export class CancleOrderDto {
  @ApiProperty({
    description: 'Reason for rejecting the cancel order request (optional)',
    type: String,
    required: false,
    example: 'The order is already being prepared.',
  })
  @IsOptional()
  @IsString({ message: 'validation.cancelorderRequestRejectReason.isString' })
  cancelorderRequestRejectReason: string;

  @ApiProperty({
    description: 'Vendor ID',
    type: String,
    required: true,
    example: '64b9e7f5c6d3a720a6b9c123',
  })
  @IsString({ message: 'validation.vendorId.isString' })
  @IsNotEmpty({ message: 'validation.vendorId.isNotEmpty' })
  vendorId: string;

  @ApiProperty({
    description: 'Status of the cancel order request',
    type: String,
    required: true,
    example: 'true',
  })
  @IsNotEmpty({ message: 'validation.cancelorderRequestStatus.isNotEmpty' })
  isCancelRequestApproved: boolean;
}

export class ModifierDto {
  @ApiProperty({
    description: 'Modifier ID as ObjectId to match schema',
    example: '60d21b4967d0d8992e610c85',
  })
  @IsMongoId({ message: 'validation.modifierId.isMongoId' })
  @IsNotEmpty({ message: 'validation.modifierId.isNotEmpty' })
  modifierId: Types.ObjectId; // Modifier ID as ObjectId to match schema

  @ApiProperty({
    description: 'Dish ID associated with the modifier',
    example: '60d21b4967d0d8992e610c86',
  })
  @IsMongoId({ message: 'validation.dishId.isMongoId' })
  @IsNotEmpty({ message: 'validation.dishId.isNotEmpty' })
  dishId: Types.ObjectId;

  @ApiProperty({ description: 'Price of the modifier', example: 10.5 })
  @IsNumber({}, { message: 'validation.price.isNumber' })
  @Min(0, { message: 'validation.price.min' })
  price: number; // Price of the modifier

  @ApiPropertyOptional({
    description: 'Quantity of the modifier (optional, default to 1)',
    example: 2,
  })
  @IsInt()
  @Min(1, { message: 'validation.quantity.min' })
  @IsOptional()
  quantity?: number; // Quantity of the modifier (optional, default to 1)
}

export class CreateCartItemDto {
  @ApiProperty({
    description: 'Dish ID associated with the cart item',
    example: '60d21b4967d0d8992e610c87',
  })
  @IsMongoId({ message: 'validation.dishId.isMongoId' })
  @IsNotEmpty({ message: 'validation.dishId.isNotEmpty' })
  dishId: Types.ObjectId;

  @ApiProperty({ description: 'Quantity of the dish', example: 3 })
  @IsInt()
  @Min(1, { message: 'validation.quantity.min' })
  quantity: number;

  @ApiProperty({ description: 'Price of the dish', example: 20.5 })
  @IsNumber({}, { message: 'validation.price.isNumber' })
  @Min(0, { message: 'validation.price.min' })
  price: number;

  @ApiPropertyOptional({
    description: 'Optional notes for the cart item',
    example: 'No onions, extra cheese',
  })
  @IsString({ message: 'validation.notes.isString' })
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Array of modifiers for the cart item',
    type: [ModifierDto],
  })
  @IsArray({ message: 'validation.modifiers.isArray' })
  @ValidateNested({ each: true }) // Validates each item in the array
  @Type(() => ModifierDto) // Transforms plain objects into ModifierDto instances
  @IsOptional()
  modifiers?: ModifierDto[]; // Array of modifiers
}

export class CartItemDto {
  @ApiProperty({
    description: 'Dish ID associated with the cart item',
    example: '60d21b4967d0d8992e610c87',
  })
  @IsMongoId({ message: 'validation.dishId.isMongoId' })
  @IsNotEmpty({ message: 'validation.dishId.isNotEmpty' })
  dishId: Types.ObjectId;

  @ApiProperty({ description: 'Quantity of the dish', example: 3 })
  @IsNumber()
  @Min(1, { message: 'validation.quantity.min' })
  quantity: number;

  @ApiProperty({ description: 'Price of the dish', example: 20.5 })
  @IsNumber({}, { message: 'validation.price.isNumber' })
  @Min(0, { message: 'validation.price.min' })
  price: number;

  @ApiPropertyOptional({
    description: 'Optional notes for the cart item',
    example: 'Extra cheese, no onions',
  })
  @IsOptional()
  @IsString({ message: 'validation.notes.isString' })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Array of modifiers for the cart item',
    type: [ModifierDto],
  })
  @IsArray({ message: 'validation.modifiers.isArray' })
  @ValidateNested({ each: true })
  @Type(() => ModifierDto)
  @IsOptional()
  modifiers?: ModifierDto[];
}

export class CreateCartDto {
  @ApiProperty({
    description: 'Vendor ID for the cart',
    example: '60d21b4967d0d8992e610c88',
  })
  @IsMongoId({ message: 'validation.vendorId.isMongoId' })
  @IsNotEmpty({ message: 'validation.vendorId.isNotEmpty' })
  vendorId: Types.ObjectId;

  @ApiProperty({
    description: 'Staff ID associated with the cart',
    example: '60d21b4967d0d8992e610c89',
  })
  @IsMongoId({ message: 'validation.staffId.isMongoId' })
  @IsNotEmpty({ message: 'validation.staffId.isNotEmpty' })
  userId: Types.ObjectId;

  @ApiProperty({
    description: 'Delivery address for the cart',
    example: '123 Main Street, Cityville',
  })
  @IsString({ message: 'validation.delivery_address.isString' })
  @IsNotEmpty({ message: 'validation.delivery_address.isNotEmpty' })
  deliveryAddress: string;

  @ApiProperty({ description: 'Array of cart items', type: [CartItemDto] })
  @IsArray({ message: 'validation.cartItems.isArray' })
  @IsNotEmpty({ message: 'validation.cartItems.isNotEmpty' })
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  cartItems: CartItemDto[];

  @ApiProperty({ description: 'Total amount for the cart', example: 150.75 })
  @IsNumber({}, { message: 'validation.totalAmount.isNumber' })
  @Min(0, { message: 'validation.totalAmount.min' })
  totalAmount: number;

  @ApiPropertyOptional({
    description: 'Optional notes for the cart',
    example: 'Deliver before 6 PM',
  })
  @IsOptional()
  @IsString({ message: 'validation.notes.isString' })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Flag to indicate if the cart is checked out',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isCheckedOut?: boolean;
}
