import { IsMongoId, IsOptional } from 'class-validator';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIssueDto {
  @ApiProperty({ description: 'Topic of the issue', example: 'Network Issue' })
  @IsString({ message: 'validation.issue_topic.isString' })
  @IsNotEmpty({ message: 'validation.issue_topic.notEmpty' })
  issue_topic: string;

  @ApiProperty({
    description: 'Topic of the issue slug',
    example: 'network_issue',
  })
  @IsString({ message: 'validation.issue_topic_slug.isString' })
  @IsNotEmpty({ message: 'validation.issue_topic_slug.notEmpty' })
  issue_topic_slug: string;

  @ApiProperty({
    description: 'Date of the issue',
    example: '2024-12-26T10:30:00Z',
  })
  @IsString({ message: 'validation.date.isString' })
  @IsNotEmpty({ message: 'validation.date.notEmpty' })
  date: string;

  @ApiProperty({
    description: 'Description of the issue',
    example: 'Internet connection is down',
  })
  @IsString({ message: 'validation.issue_description.isString' })
  @IsNotEmpty({ message: 'validation.issue_description.notEmpty' })
  issue_description: string;

  @ApiProperty({
    description: 'Vendor ID',
    example: '64b8a1d7a8f19c54c7a910c5',
  })
  @IsMongoId({ message: 'validation.vendorId.isMongoId' })
  @IsNotEmpty({ message: 'validation.vendorId.isNotEmpty' })
  vendorId: Types.ObjectId;

  @ApiPropertyOptional({
    description: 'Kid ID',
    example: '64b8a1d7a8f19c54c7a910c5',
  })
  @IsOptional()
  @IsMongoId({ message: 'validation.kidId.isMongoId' })
  @IsNotEmpty({ message: 'validation.kidId.isNotEmpty' })
  kidId?: Types.ObjectId;
}

export class UpdateIssueDto {
  @ApiProperty({
    description: 'Topic of the issue',
    example: 'Updated Network Issue',
  })
  @IsString({ message: 'validation.issue_topic.isString' })
  @IsNotEmpty({ message: 'validation.issue_topic.notEmpty' })
  issue_topic: string;

  @ApiProperty({
    description: 'Date of the issue',
    example: '2024-12-27T15:00:00Z',
  })
  @IsString({ message: 'validation.date.isString' })
  @IsNotEmpty({ message: 'validation.date.notEmpty' })
  date: string;

  @ApiProperty({
    description: 'Description of the issue',
    example: 'Updated: Internet connection is slow',
  })
  @IsString({ message: 'validation.issue_description.isString' })
  @IsNotEmpty({ message: 'validation.issue_description.notEmpty' })
  issue_description: string;

  @ApiProperty({
    description: 'Vendor ID',
    example: '64b8a1d7a8f19c54c7a910c6',
  })
  @IsMongoId({ message: 'validation.vendorId.isMongoId' })
  @IsNotEmpty({ message: 'validation.vendorId.isNotEmpty' })
  vendorId: Types.ObjectId;

  @ApiPropertyOptional({
    description: 'Kid ID',
    example: '64b8a1d7a8f19c54c7a910c5',
  })
  @IsOptional()
  @IsMongoId({ message: 'validation.kidId.isMongoId' })
  @IsNotEmpty({ message: 'validation.kidId.isNotEmpty' })
  kidId?: Types.ObjectId;
}
