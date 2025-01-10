import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancleOrderRequestDto {
  @ApiProperty({
    description: 'Description for canceling the order',
    example: 'Order canceled due to delayed delivery',
  })
  @IsNotEmpty({ message: 'validation.cancelOrderDescription.notEmpty' })
  @IsString({ message: 'validation.cancelOrderDescription.isString' })
  cancelOrderDescription: string;

  //   @ApiProperty({
  //     description: 'Date when the order was canceled',
  //     example: '2024-12-31T12:00:00Z',
  //   })
  //   @IsDateString({}, { message: 'validation.cancelOrderDate.isDateString' })
  //   cancelOrderDate: Date;
}
