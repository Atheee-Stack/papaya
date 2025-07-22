import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import { ValidationError } from 'class-validator';

interface ExceptionResponse {
  statusCode: number;
  message: string;
  errors: string[];
}

interface ExpressResponse {
  status: (code: number) => ExpressResponse;
  json: (body: ExceptionResponse) => ExpressResponse;
}

@Catch(ValidationError)
export class ValidationFilter implements ExceptionFilter {
  constructor(private readonly httpAdapter?: AbstractHttpAdapter) {}

  catch(exception: ValidationError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();

    const responseBody: ExceptionResponse = {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: this.flattenValidationErrors(exception),
    };

    if (this.httpAdapter) {
      this.httpAdapter.reply(
        ctx.getResponse(),
        responseBody,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      response.status(HttpStatus.BAD_REQUEST).json(responseBody);
    }
  }

  private flattenValidationErrors(exception: ValidationError): string[] {
    const errors: string[] = [];

    if (exception.constraints) {
      Object.values(exception.constraints).forEach((constraint: string) => {
        errors.push(constraint);
      });
    }

    if (exception.children && exception.children.length > 0) {
      exception.children.forEach((child: ValidationError) => {
        errors.push(...this.flattenValidationErrors(child));
      });
    }

    return errors;
  }
}
