import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { Logger } from 'nestjs-pino';

import { CorsError } from '@/common/errors/cors.error';
import { AUTH_COOKIES, AUTH_TOKENS } from '@/features/auth/auth.constants';
import { RedisIoAdapter } from '@/libs/adapters/reids-io.adapter';
import { CorsExceptionFilter } from '@/libs/filters/cors-exception.filter';
import { MongooseExceptionFilter } from '@/libs/filters/mongoose-exception.filter';

import { AppModule } from './app.module';
import { config } from './config';

mongoose.set('debug', true);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Set logger
  app.useLogger(app.get(Logger));

  // Set cors
  const allowedOrigins = config.CORS.ALLOWED_ORIGINS.split(',');

  app.enableCors({
    credentials: true,
    origin: (origin, cb) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        return cb(null, true);
      }
      return cb(new CorsError('Not allowed by CORS.'));
    },
  });

  const apiPrefix = config.APP.API_PATH;

  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new MongooseExceptionFilter(),
    new CorsExceptionFilter(),
  );

  app.use(helmet());
  app.use(cookieParser());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Set socket adapter
  const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Set swagger docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('RESTful API')
    .setDescription("Chatto's RESTful API")
    .setVersion('1.0')
    .addCookieAuth(
      AUTH_COOKIES.refreshToken,
      {
        in: 'cookie',
        name: AUTH_COOKIES.refreshToken,
        type: 'apiKey',
      },
      AUTH_COOKIES.refreshToken,
    )
    .addBearerAuth(
      {
        in: 'header',
        name: AUTH_TOKENS.accessToken,
        scheme: 'bearer',
        type: 'http',
      },
      AUTH_TOKENS.accessToken,
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, swaggerDocument);

  // Start app
  const port = config.APP.LISTENING_PORT;
  await app.listen(port);
}
bootstrap();
