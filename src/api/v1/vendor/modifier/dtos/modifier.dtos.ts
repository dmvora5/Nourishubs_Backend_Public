import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class ModifierDto {
  @ApiPropertyOptional({
    description: 'Vendor ID referencing the vendor table',
    example: '63f1f5c2f15b12cd1a0b25d7',
  })
  @IsOptional()
  @IsMongoId({ message: 'validation.vendor.isMongoId' })
  @IsDefined({ message: 'validation.vendor.isDefined' })
  vendor: string; // References the vendors table

  @ApiProperty({
    description: 'The name of the modifier',
    example: 'Extra Toppings',
  })
  @IsNotEmpty({ message: 'validation.name.notEmpty' })
  @IsString({ message: 'validation.name.isString' })
  name: string;

  @ApiProperty({
    description: 'Array of dish IDs associated with this modifier',
    example: ['63f1f5c2f15b12cd1a0b25d7', '63f1f5c2f15b12cd1a0b25d8'],
  })
  @IsArray({ message: 'validation.dishId.isArray' })
  @IsMongoId({ each: true })
  @IsNotEmpty({ message: 'validation.dishId.notEmpty' })
  dishIds: Types.ObjectId[];

  @ApiPropertyOptional({
    description: 'Specifies if the customer is required to select a dish',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  requireCustomerToSelectDish?: boolean;

  @ApiProperty({
    description: 'The rule defining how many items the customer must select',
    enum: ['exactly', 'atleast', 'maximum'],
    example: 'exactly',
  })
  @IsEnum(['exactly', 'atleast', 'maximum'])
  @IsOptional()
  required_rule: string;

  @ApiProperty({
    description: 'The quantity of items the customer must select',
    example: 2,
  })
  @IsNumber({}, { message: 'validation.quantity.isNumber' })
  @IsOptional()
  quantity: number;

  @ApiPropertyOptional({
    description:
      'Specifies if there is a maximum amount of items a customer can select',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  what_the_maximum_amount_of_item_customer_can_select?: boolean;

  @ApiPropertyOptional({
    description: 'The maximum number of items a customer can select',
    example: 5,
  })
  @IsNumber({}, { message: 'validation.max_selection.isNumber' })
  @IsOptional()
  max_selection?: number;

  @ApiPropertyOptional({
    description: 'Additional notes for the modifier',
    example: 'Customers can choose only up to 2 extra toppings.',
  })
  @IsString({ message: 'validation.notes.isString' })
  @IsOptional()
  notes: string;
}
