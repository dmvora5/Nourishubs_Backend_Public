import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";




export class KidIdDto {
  @ApiProperty({
    description: 'Kid ID associated with the cart',
    example: '64b2fae5b16c2b1a58f4d8e9',
    required: false,
  })
  @IsMongoId({ message: 'validation.kidId.isMongoId' })
  kidId: string;
}