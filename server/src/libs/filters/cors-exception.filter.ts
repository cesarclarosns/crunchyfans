import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { CorsError } from '@/common/errors/cors.error';

@Catch(CorsError)
export class CorsExceptionFilter implements ExceptionFilter {
  catch(exception: CorsError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse() as Response;

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      message: exception.message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
