import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { AppModule } from '@/app.module';
import { RedisIoAdapter } from '@/common/application/libs/adapters/reids-io.adapter';
import { CorsExceptionFilter } from '@/common/application/libs/filters/cors-exception.filter';
import { MongooseExceptionFilter } from '@/common/application/libs/filters/mongoose-exception.filter';
import { CorsError } from '@/common/domain/errors/cors.error';
import { appSettings, corsSettings } from '@/config';
import { AuthCookies } from '@/modules/auth/domain/enums/auth-cookies';
import { AuthTokens } from '@/modules/auth/domain/enums/auth-tokens';

// mongoose.set('debug', true);

function setCors(app: INestApplication) {
  const allowedOrigins = corsSettings.ALLOWED_ORIGINS.split(',');

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
      AuthCookies.refreshToken,
      {
        in: 'cookie',
        name: AuthCookies.refreshToken,
        type: 'apiKey',
      },
      AuthCookies.refreshToken,
    )
    .addBearerAuth(
      {
        in: 'header',
        name: AuthTokens.accessToken,
        scheme: 'bearer',
        type: 'http',
      },
      AuthTokens.accessToken,
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(
    `${appSettings.API_ROOT_PATH}/docs`,
    app,
    swaggerDocument,
  );
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
  app.setGlobalPrefix(appSettings.API_ROOT_PATH);

  await app.listen(appSettings.API_PORT);
}
bootstrap();
