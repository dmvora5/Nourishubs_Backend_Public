import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";



@ValidatorConstraint({ name: 'IsStringObject', async: false })
export class IsStringObjectConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'object') return false;

    for (const key in value) {
      if (typeof key !== 'string' || typeof value[key] !== 'string') {
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'All keys and values in documents must be strings';
  }
}


export class DocumentRequestDto {
    @ApiProperty({
      description:
        'A map of documents where the key is a string and the value is a string.',
      example: { document1: 'url1', document2: 'url2' },
    })
    @IsNotEmpty({ message: 'validation.documents.notEmpty' })
    @IsDefined({ message: 'validation.documents.isDefined' })
    @Validate(IsStringObjectConstraint)
    documents: Map<string, string>;
  }


  export class ThressHoldRequestDto {
    @ApiProperty({ description: 'Minimum threshold', example: 10 })
    @IsNumber()
    minThresHold: number;
  }
  

  export class CloseRequestDto {
    @ApiProperty({
      example: 'Request for vendor closure',
      description: 'Optional reason for the closure request',
      required: false,
    })
    @IsOptional()
    @IsString({ message: 'validation.reason.isString' })
    reason: string;
  
    @ApiProperty({
      example: '60f71b8f4f1a256e4c8a1234',
      description: 'Vendor ID to identify the vendor',
    })
    @IsString({ message: 'validation.userId.isString' })
    @IsNotEmpty({ message: 'validation.userId.isNotEmpty' })
    userId: string;
  
    @ApiProperty({
      example: true,
      description: 'Approval status for the closure request',
    })
    @IsBoolean()
    @IsNotEmpty({ message: 'validation.approved.isNotEmpty' })
    approved: boolean;
  }