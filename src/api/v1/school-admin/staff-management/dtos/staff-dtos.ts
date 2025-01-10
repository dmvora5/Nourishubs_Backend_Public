import { IsEmail, IsMongoId, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";


export class StaffDto {
    @IsString({ message: 'validation.firstName.isString' })
    @IsNotEmpty({ message: 'validation.firstName.notEmpty' })
    first_name: string;

    @IsString({ message: 'validation.lastName.isString' })
    @IsNotEmpty({ message: 'validation.lastName.notEmpty' })
    last_name: string;

    @IsEmail({}, { message: 'validation.email.isEmail' })
    @IsNotEmpty({ message: 'validation.email.notEmpty' })
    email: string;

    @IsPhoneNumber(null, { message: 'validation.phoneNo.isPhoneNumber' })
    @IsString({ message: 'validation.phoneNo.isString' })
    @IsNotEmpty({ message: 'validation.phoneNo.notEmpty' })
    phoneNo: string;

        
    @IsNotEmpty({ message: 'validation.country.notEmpty' })
    @IsString({ message: 'validation.country.isString' })
    country: string; // References the countries table

    @IsString({ message: 'validation.city.isString' })
    @IsNotEmpty({ message: 'validation.city.notEmpty' })
    city: string;

    @IsString({ message: 'validation.state.isString' })
    @IsNotEmpty({ message: 'validation.state.notEmpty' })
    state: string;

    @IsString({ message: 'validation.district.isString' })
    @IsNotEmpty({ message: 'validation.district.notEmpty' })
    district: string;

    // @IsNumber({}, { message: 'validation.latitude.isNumber' })
    @IsNotEmpty({ message: 'validation.latitude.notEmpty' })
    latitude: number;

    // @IsNumber({}, { message: 'validation.longitude.isNumber' })
    @IsNotEmpty({ message: 'validation.longitude.notEmpty' })
    longitude: number;

    @IsString({ message: 'validation.address.isString' })
    @IsNotEmpty({ message: 'validation.address.notEmpty' })
    address: string;

    @IsString({ message: 'validation.role.isString' })
    @IsNotEmpty({ message: 'validation.role.notEmpty' })
    @IsMongoId()
    role: string;
}