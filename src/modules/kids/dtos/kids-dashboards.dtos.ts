import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Max, Min } from 'class-validator';

import { IsNotEmpty, IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateKidsDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary', required: true })
  @IsOptional()
  file: Express.Multer.File;

  @ApiProperty({ description: 'First name of the child' })
  @IsString({ message: 'validation.firstName.isString' })
  @IsNotEmpty({ message: 'validation.firstName.notEmpty' })
  first_name: string;

  @ApiProperty({ description: 'Last name of the child' })
  @IsString({ message: 'validation.lastName.isString' })
  @IsNotEmpty({ message: 'validation.lastName.notEmpty' })
  last_name: string;

  @ApiProperty({ description: 'School ID in MongoDB format' })
  @IsMongoId({ message: 'validation.schoolId.isMongoId' })
  @IsString({ message: 'validation.schoolName.isString' })
  schoolId: string;

  @ApiProperty({ description: 'Age of the child' })
  @IsNumber({}, { message: 'validation.age.IsNumber' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'validation.age.notEmpty' })
  age: number;

  @ApiProperty({ description: 'Class of the child' })
  @IsString({ message: 'validation.class.isString' })
  @IsNotEmpty({ message: 'validation.class.notEmpty' })
  class: string;

  @ApiProperty({ description: 'Gender of the child' })
  @IsString({ message: 'validation.gender.isString' })
  @IsNotEmpty({ message: 'validation.gender.notEmpty' })
  gender: string;

  @ApiProperty({ description: 'Grade of the child' })
  @IsString({ message: 'validation.grade.isString' })
  @IsNotEmpty({ message: 'validation.grade.notEmpty' })
  grade: string;

  // @ApiPropertyOptional({ description: 'Parent ID in MongoDB format' })
  // @IsMongoId({ message: 'validation.parentId.isMongoId' })
  // @IsOptional()
  // parentId: string;

  @ApiProperty({ description: 'Height of the child' })
  @IsString({ message: 'validation.height.isString' })
  @IsNotEmpty({ message: 'validation.height.notEmpty' })
  height: string;

  @ApiProperty({ description: 'Weight of the child' })
  @IsString({ message: 'validation.weight.isString' })
  @IsNotEmpty({ message: 'validation.weight.notEmpty' })
  weight: string;

  @ApiPropertyOptional({ description: 'Allergies or dietary descriptions' })
  @IsOptional()
  @IsString({ message: 'validation.allergiesOrDietaryDescription.isString' })
  allergiesOrDietaryDescription: string;

  @ApiProperty({ description: 'Country of residence' })
  @IsNotEmpty({ message: 'validation.country.notEmpty' })
  @IsString({ message: 'validation.country.isString' })
  country: string;

  @ApiProperty({ description: 'City of residence' })
  @IsString({ message: 'validation.city.isString' })
  @IsNotEmpty({ message: 'validation.city.notEmpty' })
  city: string;

  @ApiProperty({ description: 'State of residence' })
  @IsString({ message: 'validation.state.isString' })
  @IsNotEmpty({ message: 'validation.state.notEmpty' })
  state: string;

  @ApiProperty({ description: 'District of residence' })
  @IsString({ message: 'validation.district.isString' })
  @IsNotEmpty({ message: 'validation.district.notEmpty' })
  district: string;

  @ApiProperty({ description: 'Latitude of location' })
  @IsNotEmpty({ message: 'validation.latitude.notEmpty' })
  latitude: number;

  @ApiProperty({ description: 'Longitude of location' })
  @IsNotEmpty({ message: 'validation.longitude.notEmpty' })
  longitude: number;

  @ApiProperty({ description: 'Address of residence' })
  @IsString({ message: 'validation.address.isString' })
  @IsNotEmpty({ message: 'validation.address.notEmpty' })
  address: string;
}

export class UpdateKidsDto {

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  file?: Express.Multer.File;

  @ApiProperty({ description: 'First name of the child' })
  @IsString({ message: 'validation.firstName.isString' })
  @IsNotEmpty({ message: 'validation.firstName.notEmpty' })
  first_name: string;

  @ApiProperty({ description: 'Last name of the child' })
  @IsString({ message: 'validation.lastName.isString' })
  @IsNotEmpty({ message: 'validation.lastName.notEmpty' })
  last_name: string;

  @ApiProperty({ description: 'School ID in MongoDB format' })
  @IsMongoId({ message: 'validation.schoolId.isMongoId' })
  @IsString({ message: 'validation.schoolName.isString' })
  schoolId: string;

  @ApiProperty({ description: 'Age of the child' })
  @IsString({ message: 'validation.age.IsString' })
  @IsNotEmpty({ message: 'validation.age.notEmpty' })
  age: string;

  @ApiProperty({ description: 'Class of the child' })
  @IsString({ message: 'validation.class.isString' })
  @IsNotEmpty({ message: 'validation.class.notEmpty' })
  class: string;

  @ApiProperty({ description: 'Gender of the child' })
  @IsString({ message: 'validation.gender.isString' })
  @IsNotEmpty({ message: 'validation.gender.notEmpty' })
  gender: string;

  @ApiProperty({ description: 'Grade of the child' })
  @IsString({ message: 'validation.grade.isString' })
  @IsNotEmpty({ message: 'validation.grade.notEmpty' })
  grade: string;

//   @ApiProperty({ description: 'Image URL of the child' })
//   @IsString({ message: 'validation.imgUrl.isString' })
//   @IsNotEmpty({ message: 'validation.imgUrl.notEmpty' })
//   imgUrl: string;

  // @ApiPropertyOptional({ description: 'Parent ID in MongoDB format' })
  // @IsMongoId({ message: 'validation.parentId.isMongoId' })
  // @IsOptional()
  // parentId: string;

  @ApiProperty({ description: 'Height of the child' })
  @IsString({ message: 'validation.height.isString' })
  @IsNotEmpty({ message: 'validation.height.notEmpty' })
  height: string;

  @ApiProperty({ description: 'Weight of the child' })
  @IsString({ message: 'validation.weight.isString' })
  @IsNotEmpty({ message: 'validation.weight.notEmpty' })
  weight: string;

  @ApiPropertyOptional({ description: 'Allergies or dietary descriptions' })
  @IsOptional()
  @IsString({ message: 'validation.allergiesOrDietaryDescription.isString' })
  allergiesOrDietaryDescription: string;

  @ApiProperty({ description: 'Country of residence' })
  @IsNotEmpty({ message: 'validation.country.notEmpty' })
  @IsString({ message: 'validation.country.isString' })
  country: string;

  @ApiProperty({ description: 'City of residence' })
  @IsString({ message: 'validation.city.isString' })
  @IsNotEmpty({ message: 'validation.city.notEmpty' })
  city: string;

  @ApiProperty({ description: 'State of residence' })
  @IsString({ message: 'validation.state.isString' })
  @IsNotEmpty({ message: 'validation.state.notEmpty' })
  state: string;

  @ApiProperty({ description: 'District of residence' })
  @IsString({ message: 'validation.district.isString' })
  @IsNotEmpty({ message: 'validation.district.notEmpty' })
  district: string;

  @ApiProperty({ description: 'Latitude of location' })
  @IsNotEmpty({ message: 'validation.latitude.notEmpty' })
  latitude: number;

  @ApiProperty({ description: 'Longitude of location' })
  @IsNotEmpty({ message: 'validation.longitude.notEmpty' })
  longitude: number;

  @ApiProperty({ description: 'Address of residence' })
  @IsString({ message: 'validation.address.isString' })
  @IsNotEmpty({ message: 'validation.address.notEmpty' })
  address: string;
}
