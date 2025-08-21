import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = response.statusCode;

    const exceptionResponse = exception.getResponse();
    let errorMessage: string;
    let errorDetails: any = null;

    if (typeof exceptionResponse === 'string') {
      errorMessage = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      errorMessage =
        (exceptionResponse as any).message ||
        'Ha ocurrido un error inesperado.';
      errorDetails = exceptionResponse;
    } else {
      errorMessage = 'Ha ocurrido un error inesperado en el servidor.';
    }

    response.status(statusCode).json({
      status: 'error',
      statusCode,
      error: {
        message: errorMessage,
        code: HttpStatus[statusCode]?.replace(/_/g, ' ') || 'UNEXPECTED_ERROR',
        details: errorDetails,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
