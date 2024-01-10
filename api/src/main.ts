/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'F62BD3D2528833573EAA53AC9727C',
      resave: false,
      saveUninitialized: false,
    }),
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
