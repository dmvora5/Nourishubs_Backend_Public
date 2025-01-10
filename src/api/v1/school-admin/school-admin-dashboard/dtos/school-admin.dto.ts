import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";


export class RequestDto {
    @ApiProperty({
        description: 'Parent ID in MongoDB format',
        example: '64b8a1d7a8f19c54c7a910c5',
    })
    @IsMongoId({ message: 'validation.parentId.isMongoId' })
    @IsNotEmpty({ message: 'validation.parentId.isNotEmpty' })
    parentId: string;

    @ApiProperty({
        description: 'Kid ID in MongoDB format',
        example: '64b8a1d7a8f19c54c7a910c6',
    })
    @IsMongoId({ message: 'validation.kidId.isMongoId' })
    @IsNotEmpty({ message: 'validation.kidId.isNotEmpty' })
    kidId: string;

    @ApiProperty({
        description: 'Reason for rejection, optional field',
        example: 'Incomplete information',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'validation.reason.isString' })
    rejectReason: string;

    @ApiProperty({
        description: 'Verification status of the request',
        example: 'Pending',
    })
    @IsString({ message: 'validation.verificationStatus.isString' })
    @IsNotEmpty({ message: 'validation.verificationStatus.isNotEmpty' })
    verificationStatus: string;
}


export class UpdateSchoolDto {
    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    @IsOptional()
    file?: Express.Multer.File;

    @ApiProperty({ description: 'First name of the person', example: 'John' })
    @IsString({ message: 'validation.firstName.isString' })
    @IsNotEmpty({ message: 'validation.firstName.notEmpty' })
    first_name: string;

    @ApiProperty({ description: 'Last name of the person', example: 'Doe' })
    @IsString({ message: 'validation.lastName.isString' })
    @IsNotEmpty({ message: 'validation.lastName.notEmpty' })
    last_name: string;

    @ApiProperty({
        description: 'Name of the school',
        example: 'Green Valley High School',
    })
    @IsString({ message: 'validation.schoolName.isString' })
    @IsNotEmpty({ message: 'validation.schoolName.notEmpty' })
    schoolName: string;

    @ApiProperty({
        description: 'Email address',
        example: 'john.doe@example.com',
    })
    @IsEmail({}, { message: 'validation.email.isEmail' })
    @IsNotEmpty({ message: 'validation.email.notEmpty' })
    email: string;

    @ApiProperty({ description: 'Age of the person', example: 35 })
    @IsNumber({}, { message: 'validation.age.isNumber' })
    @IsNotEmpty({ message: 'validation.age.notEmpty' })
    age: number;

    @ApiProperty({ description: 'Gender of the person', example: 'Male' })
    @IsString({ message: 'validation.gender.isString' })
    @IsNotEmpty({ message: 'validation.gender.notEmpty' })
    gender: string;

    @ApiProperty({
        description: 'Phone number of the person',
        example: '+1234567890',
    })
    @IsString({ message: 'validation.phoneNo.isString' })
    @IsNotEmpty({ message: 'validation.phoneNo.notEmpty' })
    @IsPhoneNumber(null, { message: 'validation.phoneNo.isPhoneNumber' })
    phoneNo: string;

    @ApiProperty({
        description: 'Latitude coordinate of the location',
        example: 37.7749,
    })
    @IsNumber({}, { message: 'validation.latitude.isNumber' })
    @IsNotEmpty({ message: 'validation.latitude.notEmpty' })
    latitude: number;

    @ApiProperty({
        description: 'Longitude coordinate of the location',
        example: -122.4194,
    })
    @IsNumber({}, { message: 'validation.longitude.isNumber' })
    @IsNotEmpty({ message: 'validation.longitude.notEmpty' })
    longitude: number;

    @ApiProperty({
        description: 'Residential address',
        example: '123 Main St, Springfield',
    })
    @IsString({ message: 'validation.address.isString' })
    @IsNotEmpty({ message: 'validation.address.notEmpty' })
    address: string;
}


export class DeleteDocumentDto {
    @IsString({ message: 'validation.docType.isString' })
    @IsNotEmpty({ message: 'validation.docType.notEmpty' })
    docType: string;
}