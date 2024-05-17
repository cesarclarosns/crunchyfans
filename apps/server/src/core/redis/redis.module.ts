import { Module } from '@nestjs/common';
import { createClient } from 'redis';

import { settings } from '@/config/settings';

export const RedisClient = Symbol('RedisClient');

@Module({
  exports: [RedisClient],
  imports: [],
  providers: [
    {
      provide: RedisClient,
      useFactory: async () => {
        const client = createClient({ url: settings.DATABASES.REDIS_URL });
        await client.connect();
        return client;
      },
    },
  ],
})
export class RedisModule {}
