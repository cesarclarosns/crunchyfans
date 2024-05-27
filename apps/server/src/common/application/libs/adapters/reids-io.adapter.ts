import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-streams-adapter';
import jwt from 'jsonwebtoken';
import { createClient, createCluster } from 'redis';
import { ServerOptions } from 'socket.io';

import { CorsError } from '@/common/domain/errors/cors.error';
import { settings } from '@/config/settings';
import { AUTH_TOKENS } from '@/modules/auth/domain/constants/auth-tokens';
import { TokenPayload } from '@/modules/auth/domain/types/token-payload';
import { CustomServer } from '@/modules/socket/domain/types/socket';

export class RedisIoAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  private adapater: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const redisClient = createClient({
      url: settings.DATABASES.REDIS_URL,
    });
    await redisClient.connect();
    this.adapater = createAdapter(redisClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    if (options) {
      // Set cors
      const allowedOrigins = settings.CORS.ALLOWED_ORIGINS.split(',');
      options.cors = {
        origin: (origin, cb) => {
          if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
            return cb(null, true);
          }
          return cb(new CorsError('Not allowed by CORS.'));
        },
      };

      options.transports = ['websocket'];
      options.path = settings.SOCKET.PATH;
    }

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
          settings.AUTH.JWT_ACCESS_SECRET,
        ) as TokenPayload;

        next();
      } catch (err) {
        next(err);
      }
    });

    server.adapter(this.adapater);

    return server;
  }
}
