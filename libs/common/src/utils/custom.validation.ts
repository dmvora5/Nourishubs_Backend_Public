import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidObjectId } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import * as moment from 'moment';

function mapErrors(
  errors: ValidationError[],
  i18Service: I18nService,
): { [key: string]: string } {
  return errors.reduce((acc, error) => {
    const constraints = Object.keys(error.constraints || {}).map(
      (constraint) => {
        return i18Service.translate(
          `validation.${error.property}.${constraint}`,
          // `validation.${constraint}`,

          // {
          //   args: { value: error.property },
          // },
        );
      },
    )[0];

    if (constraints) {
      acc[error.property] = constraints;
    }

    if (error.children && error.children.length > 0) {
      const nestedErrors = mapErrors(error.children, i18Service);
      for (const [key, value] of Object.entries(nestedErrors)) {
        acc[key] = value;
      }
    }

    return acc;
  }, {});
}

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor(private readonly i18Service: I18nService) {
    super({
      exceptionFactory: (errors: ValidationError[]) => {
        const mappedErrors = mapErrors(errors, this.i18Service);
        return new BadRequestException({
          status: false,
          statusCode: 400,
          message: i18Service.translate('messages.ValidationFailed'),
          errors: mappedErrors,
        });
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  }

  transform(value: any, metadata: ArgumentMetadata) {
    return super.transform(value, metadata);
  }
}

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform {
  constructor(private readonly i18n: I18nService) {}
  async transform(value: string) {
    if (!isValidObjectId(value)) {
      const errorMessage = await this.i18n.translate(
        'validation.invalidObjectId',
        {
          args: { value },
        },
      );
      throw new BadRequestException(errorMessage);
    }
    return value;
  }
}

@ValidatorConstraint({ name: 'CustomTimeValidator', async: false })
export class CustomTimeValidator implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    const obj = args.object as any; // Cast to access properties dynamically
    const openingTime = obj.openingTime;
    const closingTime = obj.closingTime;
    // Parse times into 24-hour format using moment.js
    const opening = moment(openingTime, 'hh:mm A', true); // true for strict parsing
    const closing = moment(closingTime, 'hh:mm A', true);

    if (!opening.isValid() || !closing.isValid()) {
      return false; // Invalid time format
    }

    return closing.isAfter(opening); // Ensure closing time is after opening time
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Closing time must be later than opening time.';
  }
}
