import { AccessTokenGuard } from './auth/guards/access-token.guard';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(cookieParser());
  app.use(helmet());

  const reflector = new Reflector();
  app.useGlobalGuards(new AccessTokenGuard(reflector));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
