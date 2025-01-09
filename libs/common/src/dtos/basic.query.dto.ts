import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class BasicQueryDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @IsString()
    searchQuery?: string;

    @IsOptional()
    @IsObject()
    orderBy?: object
}


export class SearchNearByQuery extends BasicQueryDto {
    @ApiProperty({ description: 'Latitude of the location' })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(-90, { message: 'Latitude must be between -90 and 90' })
    @Max(90, { message: 'Latitude must be between -90 and 90' })
    lat: number;

    @ApiProperty({ description: 'Longitude of the location' })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(-180, { message: 'Longitude must be between -180 and 180' })
    @Max(180, { message: 'Longitude must be between -180 and 180' })
    lng: number;

   
}