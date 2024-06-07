import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';

import { databaseSettings } from '@/config';

export type RedisClient = Redis;
export const RedisClient = Symbol('RedisClient');

@Module({
  exports: [RedisClient],
  imports: [],
  providers: [
    {
      provide: RedisClient,
      useFactory: async () => {
        const redis = new Redis(databaseSettings.REDIS_URL);
        await redis.connect();
        return redis;
      },
    },
  ],
})
export class RedisModule {}
