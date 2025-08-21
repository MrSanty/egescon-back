import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

export interface ResponseData<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable()
export class TransformationInterceptor<T>
  implements NestInterceptor<T, ResponseData<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseData<T>> {
    const response = context.switchToHttp().getResponse();

    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ||
      'Operación exitosa';

    return next.handle().pipe(
      map((data) => ({
        status: 'success',
        statusCode: response.statusCode,
        message: message,
        data: data,
      })),
    );
  }
}
