import { Injectable } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  registerDecorator,
  ValidationOptions,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as moment from 'moment';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'NoRecurringDayConflict', async: false })
@Injectable()
export class NoRecurringDayConflict implements ValidatorConstraintInterface {
  validate(events: any[], args: ValidationArguments) {
    const recurringDays = new Set();

    for (const event of events || []) {
      const { isRecurring, date } = event;

      const dayOfWeek = moment(date).format('dddd');

      if (recurringDays.has(dayOfWeek)) {
        return false;
      }

      if (isRecurring) {
        recurringDays.add(dayOfWeek);
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Conflicting recurring events: A recurring event for the selected day already exists.';
  }
}

// @ValidatorConstraint({ name: 'IsFutureDate', async: false })
// @Injectable()
// export class IsFutureDate implements ValidatorConstraintInterface {
//   validate(date: string) {
//     const startOfNextDay = moment().add(1, 'days').startOf('day');
//     return moment(date).isAfter(startOfNextDay);
//   }

//   defaultMessage() {
//     return 'The date must be from the start of the next day.';
//   }
// }

// @ValidatorConstraint({ name: 'IsEndDateGreaterThanDate', async: false })
// @Injectable()
// export class IsEndDateGreaterThanDate implements ValidatorConstraintInterface {
//   validate(endDate: string, args: ValidationArguments) {
//     const { date } = args.object as VenderDayDto;
//     return moment(endDate).isAfter(moment(date));
//   }

//   defaultMessage() {
//     return 'The end date must be in the future and greater than the selected date.';
//   }
// }

@ValidatorConstraint({ name: 'IsISODateOnly', async: false })
export class IsISODateOnlyConstraint implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments): boolean {
    const today = moment().startOf('day'); // Get the start of today
    const providedDate = moment(date, 'YYYY-MM-DD', true); // Strict format validation

    // Check if the provided date is valid and not before today
    if (!providedDate.isValid()) {
      (args as any).customMessage = 'date must be in the format YYYY-MM-DD'; // Custom message for invalid format
      return false;
    }

    if (!providedDate.isAfter(today)) {
      (args as any).customMessage = 'date cannot be earlier than today'; // Custom message for date in the past
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    // Return the custom message set during validation
    return (args as any).customMessage || 'Invalid date';
  }
}

export function IsISODateOnly(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsISODateOnlyConstraint,
    });
  };
}

export class VenderDayDto {
  @ApiProperty({
    description: 'Date of the vendor day in the format YYYY-MM-DD',
    example: '2024-12-27',
  })
  @IsISODateOnly({ message: 'date must be a valid date in the format YYYY-MM-DD' })
  date: string;

  @ApiProperty({
    description: 'Flag indicating if the vendor day should be deleted',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDelete?: boolean;

  @ApiProperty({
    description: 'Vendor ID associated with the day',
    example: '64cfd9f4b20b2a3d4e123456',
  })
  @IsString({ message: 'validation.vendorId.isString' })
  vendorId: string;

}

export class AvailbleVendor {
  @ApiProperty({
    description: 'Start date in the format YYYY-MM-DD',
    example: '2024-12-27',
  })
  @IsDateString(
    { strict: true },
    { message: 'startDate must be a valid date in the format YYYY-MM-DD' },
  )
  startDate: string;

  @ApiProperty({
    description: 'End date in the format YYYY-MM-DD',
    example: '2024-12-31',
  })
  @IsDateString(
    { strict: true },
    { message: 'endDate must be a valid date in the format YYYY-MM-DD' },
  )
  endDate: string;
}

export class CreateFoodChartsDto {
  @ApiProperty({
    description: 'Food chart details',
    example: 'detais',
  })
  details: string;
  @ApiProperty({
    description: 'Array of vendor day details',
    example: [
      {
        date: '2024-12-27',
        isDelete: false,
        vendorId: '64cfd9f4b20b2a3d4e123456',
      },
    ],
  })
  @ValidateNested({ each: true }) // Validate each event
  @Type(() => VenderDayDto)
  @Validate(NoRecurringDayConflict) // Apply the custom validator
  @ArrayNotEmpty()
  @IsArray()
  vendors: VenderDayDto[];
}

export class FooCharIdstDto {
  schoolAdminId: string;
  areaExecutiveId?: string;
}