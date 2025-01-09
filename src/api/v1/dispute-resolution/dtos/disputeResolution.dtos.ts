import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateDisputeDto {
  @ApiProperty({
    description: 'Name of the school involved in the dispute',
    example: 'Greenwood High School',
  })
  @IsString({ message: 'validation.schoolName.isString' })
  @IsNotEmpty({ message: 'validation.schoolName.notEmpty' })
  schoolName: string;

  @ApiProperty({
    description: 'Details of the order related to the dispute',
    example: 'Order #12345 - 10 school uniforms',
  })
  @IsString({ message: 'validation.orderDetail.isString' })
  @IsNotEmpty({ message: 'validation.orderDetail.notEmpty' })
  orderDetail: string;

  @ApiProperty({
    description: 'Address of the school or involved party',
    example: '123 School Street, Springfield',
  })
  @IsString({ message: 'validation.address.isString' })
  @IsNotEmpty({ message: 'validation.address.notEmpty' })
  address: string;

  @ApiProperty({
    description: 'Date when the order was placed',
    example: '2024-12-01',
  })
  @IsString({ message: 'validation.orderDate.isString' })
  @IsNotEmpty({ message: 'validation.orderDate.notEmpty' })
  orderDate: string;

  @ApiProperty({
    description: 'ID of the country related to the dispute',
    example: '64af3e07bcf86cd799439013',
  })
  @IsString({ message: 'validation.countryId.isString' })
  @IsNotEmpty({ message: 'validation.countryId.notEmpty' })
  countryId: string;

  @ApiProperty({
    description: 'ID of the issue linked to the dispute',
    example: '64af3e07bcf86cd799439014',
  })
  @IsMongoId({ message: 'validation.issueId.isMongoId' })
  @IsNotEmpty({ message: 'validation.issueId.isNotEmpty' })
  issueId: Types.ObjectId;

  @ApiProperty({
    description: 'ID of the vendor involved in the dispute',
    example: '64af3e07bcf86cd799439015',
  })
  @IsMongoId({ message: 'validation.vendorId.isMongoId' })
  @IsNotEmpty({ message: 'validation.vendorId.isNotEmpty' })
  vendorId: Types.ObjectId;
}

export class UpdateDisputeDto {
  @ApiProperty({
    description: 'Name of the school involved in the dispute',
    example: 'Greenwood High School',
  })
  @IsString({ message: 'validation.schoolName.isString' })
  @IsNotEmpty({ message: 'validation.schoolName.notEmpty' })
  schoolName: string;

  @ApiProperty({
    description: 'Details of the order related to the dispute',
    example: 'Order #12345 - 10 school uniforms',
  })
  @IsString({ message: 'validation.orderDetail.isString' })
  @IsNotEmpty({ message: 'validation.orderDetail.notEmpty' })
  orderDetail: string;

  @ApiProperty({
    description: 'Address of the school or involved party',
    example: '123 School Street, Springfield',
  })
  @IsString({ message: 'validation.address.isString' })
  @IsNotEmpty({ message: 'validation.address.notEmpty' })
  address: string;

  @ApiProperty({
    description: 'Date when the order was placed',
    example: '2024-12-01',
  })
  @IsString({ message: 'validation.orderDate.isString' })
  @IsNotEmpty({ message: 'validation.orderDate.notEmpty' })
  orderDate: string;

  @ApiProperty({
    description: 'ID of the country related to the dispute',
    example: '64af3e07bcf86cd799439013',
  })
  @IsString({ message: 'validation.countryId.isString' })
  @IsNotEmpty({ message: 'validation.countryId.notEmpty' })
  countryId: string;

  @ApiProperty({
    description: 'ID of the vendor involved in the dispute',
    example: '64af3e07bcf86cd799439015',
  })
  @IsMongoId({ message: 'validation.vendorId.isMongoId' })
  @IsNotEmpty({ message: 'validation.vendorId.isNotEmpty' })
  vendorId: Types.ObjectId;

  @ApiProperty({
    description: 'ID of the issue linked to the dispute',
    example: '64af3e07bcf86cd799439014',
  })
  @IsMongoId({ message: 'validation.issueId.isMongoId' })
  @IsNotEmpty({ message: 'validation.issueId.isNotEmpty' })
  issueId: Types.ObjectId;
}

export class ResponseDisputeDto {
  @ApiProperty({
    description: 'Response or resolution message for the dispute',
    example: 'The vendor has agreed to replace the items.',
  })
  @IsString({ message: 'validation.response.isString' })
  @IsNotEmpty({ message: 'validation.response.notEmpty' })
  response: string;
}
