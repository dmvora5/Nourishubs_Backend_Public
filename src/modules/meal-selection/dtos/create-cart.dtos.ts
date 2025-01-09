import {
  IsArray,
  IsBoolean,
  IsInt,
  ValidateNested,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsDate,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import * as moment from 'moment';

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
    description: 'Quantity of the modifier (optional, default to 1)',
    example: 1,
    required: false,
  })
  @IsInt()
  @Min(1, { message: 'validation.quantity.min' })
  @IsOptional()
  quantity?: number; // Quantity of the modifier (optional, default to 1)
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

@ValidatorConstraint({ name: 'IsISODateOnly', async: false })
export class IsISODateOnlyConstraint implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments): boolean {
    const today = moment().startOf('day'); // Get the start of today
    const providedDate = moment(date, 'YYYY-MM-DD', true); // Strict format validation

    // Check if the provided date is valid and not before today
    if (!providedDate.isValid()) {
      (args as any).customMessage = 'date must be in the format YYYY-MM-DD'; // Custom message for invalid format
      return false;
    }

    if (!providedDate.isAfter(today)) {
      (args as any).customMessage = 'date cannot be earlier than today'; // Custom message for date in the past
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    // Return the custom message set during validation
    return (args as any).customMessage || 'Invalid date';
  }
}

export function IsISODateOnly(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsISODateOnlyConstraint,
    });
  };
}

export class CreateCartDto {
  @ApiProperty({
    description: 'Vendor ID associated with the cart',
    example: '64b2fae5b16c2b1a58f4d8e9',
  })
  @IsMongoId({ message: 'validation.vendorId.isMongoId' })
  @IsNotEmpty({ message: 'validation.vendorId.isNotEmpty' })
  vendorId: Types.ObjectId;

  @ApiProperty({
    description: 'Parent ID associated with the cart',
    example: '64b2fae5b16c2b1a58f4d8e9',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'validation.parentId.isMongoId' })
  userId: Types.ObjectId;

  @ApiProperty({
    description: 'Delivery address for the cart',
    example: '123 Main St, Springfield',
  })
  @IsString({ message: 'validation.deliveryAddress.isString' })
  @IsNotEmpty({ message: 'validation.deliveryAddress.isNotEmpty' })
  deliveryAddress: string;

  @ApiProperty({
    description: 'Date of the vendor day in the format YYYY-MM-DD',
    example: '2024-12-27',
  })
  @IsISODateOnly({
    message: 'date must be a valid date in the format YYYY-MM-DD',
  })
  orderDate: string;

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

  @ApiProperty({
    description: 'Optional notes for the cart',
    example: 'Please deliver between 6-7 PM',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'validation.notes.isString' })
  notes?: string;

  @ApiProperty({
    description: 'Indicates if the cart is checked out',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isCheckedOut?: boolean;

  @ApiProperty({
    description: 'Event name associated with the cart',
    example: 'Birthday Party',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'validation.eventName.isString' })
  eventName?: string;
}


