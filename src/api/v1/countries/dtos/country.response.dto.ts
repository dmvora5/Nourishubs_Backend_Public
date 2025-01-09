import { Exclude } from "class-transformer";



export class CountryResponseDto {

    @Exclude()
    createdAt: Date;


    @Exclude()
    updatedAt: Date;
}