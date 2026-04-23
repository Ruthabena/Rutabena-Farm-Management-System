import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    response.status(status).json({
      success: false,
      path: request.url,
      timestamp: new Date().toISOString(),
      error:
        typeof exceptionResponse === 'object' && exceptionResponse
          ? exceptionResponse
          : {
              message:
                exception instanceof Error
                  ? exception.message
                  : 'Internal server error',
            },
    });
  }
}
