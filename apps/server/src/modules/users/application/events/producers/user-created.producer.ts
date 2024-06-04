import { Inject, OnModuleInit } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { RedisClient } from '@/core/redis/redis.module';
import { UserCreatedEvent } from '@/modules/users/domain/events';

export class UserCreatedProducer implements OnModuleInit {
  constructor(
    @InjectPinoLogger(UserCreatedProducer.name)
    private readonly _logger: PinoLogger,
    @Inject(RedisClient) private readonly _redisClient: RedisClient,
  ) {}

  async send(ev: UserCreatedEvent) {
    this._redisClient.xreadgroup(
      'GROUP',
      '',
      'this.consumerName',
      'COUNT',
      5,
      'BLOCK',
      5,
      'STREAMS',
      'this.streamName',
      '>',
    );
  }

  onModuleInit() {}
}
