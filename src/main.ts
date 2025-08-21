import { AccessTokenGuard } from './auth/guards/access-token.guard';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser = require('cookie-parser');
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformationInterceptor } from './common/interceptors/transformation.interceptor';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { formatValidationErrors } from './lib/formatErrors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(cookieParser());
  app.use(helmet());

  const reflector = new Reflector();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException({
          message: 'Error de Validación',
          details: formatValidationErrors(errors),
        });
      },
    }),
  );
  app.useGlobalInterceptors(new TransformationInterceptor(reflector));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalGuards(new AccessTokenGuard(reflector));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
