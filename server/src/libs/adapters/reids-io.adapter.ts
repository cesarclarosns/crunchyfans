import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import jwt from 'jsonwebtoken';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';

import { CorsError } from '@/common/errors/cors.error';
import { CustomServer } from '@/common/interfaces/socket';
import { config } from '@/config';
import { AUTH_TOKENS } from '@/features/auth/auth.constants';
import { TokenPayload } from '@/features/auth/auth.types';

export class RedisIoAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    console.log('connectToRedis()');

    const pubClient = createClient({
      url: config.CACHE.REDIS_URL,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    // Set cors
    const allowedOrigins = config.CORS.ALLOWED_ORIGINS.split(',');

    options.cors = {
      origin: (origin, cb) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
          return cb(null, true);
        }
        return cb(new CorsError('Not allowed by CORS.'));
      },
    };

    options.transports = ['websocket'];

    // Set path
    options.path = config.APP.API_SOCKET_PATH;

    // Create server
    const server = super.createIOServer(port, options) as CustomServer;

    // Set middlewares
    server.use((socket, next) => {
      try {
        const accessToken = socket.handshake.query[
          AUTH_TOKENS.accessToken
        ] as string;

        socket.data = jwt.verify(
          accessToken,
          config.AUTH.JWT_ACCESS_SECRET,
        ) as TokenPayload;

        next();
      } catch (err) {
        next(err);
      }
    });

    // Set adapater
    // (async () => {
    //   await this.connectToRedis();
    // })();

    // server.adapter(this.adapterConstructor);

    return server;
  }
}
