import { Injectable,BadRequestException,ValidationError } from '@nestjs/common';

@Injectable()
export class CommonResponseService {
  success(message: string, response: any = {}, meta: any = {}): object {
    return {
      status: true,
      message,
      response,
      meta,
    };
  }

  error(message: string, error: any = null): object {
    return {
      status: false,
      message,
      error,
    };
  }
}
