import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { RedisIoAdapter } from '@/common/application/libs/adapters/reids-io.adapter';
import { CorsExceptionFilter } from '@/common/application/libs/filters/cors-exception.filter';
import { MongooseExceptionFilter } from '@/common/application/libs/filters/mongoose-exception.filter';
import { CorsError } from '@/common/domain/errors/cors.error';
import { AUTH_COOKIES } from '@/modules/auth/domain/constants/auth-cookies';
import { AUTH_TOKENS } from '@/modules/auth/domain/constants/auth-tokens';

import { AppModule } from './app.module';
import { settings } from './config/settings';

// mongoose.set('debug', true);

function setCors(app: INestApplication) {
  const allowedOrigins = settings.CORS.ALLOWED_ORIGINS.split(',');

  app.enableCors({
    credentials: true,
    origin: (origin, cb) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        return cb(null, true);
      }
      return cb(new CorsError('Not allowed by CORS.'));
    },
  });
}

function setSwagger(app: INestApplication) {
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
  SwaggerModule.setup(`${settings.API.PREFIX}/docs`, app, swaggerDocument);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Set cors
  setCors(app);

  // Set middlewares
  app.useLogger(app.get(Logger));
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
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Set swagger
  setSwagger(app);

  // Start app
  app.setGlobalPrefix(settings.API.PREFIX);

  await app.listen(settings.API.LISTENING_PORT);
}
bootstrap();
