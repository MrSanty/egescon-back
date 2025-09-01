import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

const ERROR_CODES = {
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    let fields: any = null;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else {
      const res = { ...(exceptionResponse as any) };
      message = res.message || 'Ha ocurrido un error inesperado.';

      delete res.message;
      delete res.statusCode;
      delete res.error;

      const remainingKeys = Object.keys(res);

      if (remainingKeys.length > 0) {
        for (const key of remainingKeys) {
          if (Array.isArray(res[key])) {
            const messages = res[key].map((error) => error.message);
            fields.push(...messages);
          }
        }
      }
    }

    const errorResponse: any = {
      status: 'error',
      statusCode,
      path: request.url,
      timestamp: new Date().toISOString(),
      errorCode: ERROR_CODES[statusCode] || 'UNKNOWN_ERROR',
      message,
    };

    if (fields) {
      errorResponse.fields = fields;
    }

    response.status(statusCode).json(errorResponse);
  }
}
