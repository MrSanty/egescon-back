import { AccessTokenGuard } from './auth/guards/access-token.guard';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser = require('cookie-parser');
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformationInterceptor } from './common/interceptors/transformation.interceptor';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { formatValidationErrors } from './lib/formatErrors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PermissionsGuard } from './auth/guards/permissions.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(cookieParser());
  app.use(helmet());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('API eGescon')
    .setDescription('Documentación de la API para el sistema eGescon')
    .setVersion('1.0')
    .addCookieAuth('access_token') // Esto nos permitirá probar endpoints protegidos
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException({
          message: 'Error al verificar los datos de entrada.',
          ...formatValidationErrors(errors),
        });
      },
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TransformationInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalGuards(
    new AccessTokenGuard(app.get(Reflector)),
    new PermissionsGuard(app.get(Reflector)),
  );

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
