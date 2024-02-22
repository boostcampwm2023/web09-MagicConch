import { HttpException } from '@nestjs/common';
import { ExceptionMetadata } from './metadata';

/**
 * https://github.com/nestjs/nest/blob/master/packages/common/exceptions/http.exception.ts
 */
export class CustomException extends HttpException {
  constructor({ status, message, code, description }: ExceptionMetadata) {
    super({ message, code, description }, status);
  }
}
