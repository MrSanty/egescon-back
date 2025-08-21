import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorMessage =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message;

    response.status(statusCode).json({
      status: 'error',
      statusCode,
      error: {
        message: Array.isArray(errorMessage)
          ? errorMessage.join(', ')
          : errorMessage,
        details: exceptionResponse,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
