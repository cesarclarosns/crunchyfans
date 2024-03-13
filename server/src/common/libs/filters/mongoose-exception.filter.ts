import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Error as MongooseError } from 'mongoose';

@Catch(MongooseError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse() as Response;

    if (exception instanceof MongooseError.ValidationError) {
      response.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
        errors: exception.errors,
        message: exception.message,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    } else {
      response.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
        message: exception.message,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
  }
}
