import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { RedisClient } from '@/core/redis/redis.module';

export class RedisStreamsConsumer {
  client: RedisClient;
  consumerGroupName: string;
  consumerName: string;
  streamName: string;
  deadLetterStreamName: string;
  maxRetries: number;
  batchSize: number;
  blockTimeMs: number;

  async readMessages() {
    this.client.xreadgroup(
      'GROUP',
      this.consumerGroupName,
      this.consumerName,
      'COUNT',
      this.batchSize,
      'BLOCK',
      this.blockTimeMs,
      'STREAMS',
      this.streamName,
      '>',
    );
  }

  async readPendingMessages() {
    this.client.xpending('', this.consumerGroupName, 'IDLE', 1, 1);
  }

  async acknowledge(...messageIds: string[]) {
    this.client.xack('', '', ...messageIds);
  }

  async moveToDeadLetterQueue() {
    this.client.xdel('');
    this.client.xadd('');
  }

  async start() {}

  async stop() {}
}

@Injectable()
export class RedisStreamsProducer {
  constructor(
    @InjectPinoLogger(RedisStreamsProducer.name)
    private readonly _logger: PinoLogger,
    @Inject(RedisClient)
    private readonly _redisClient: RedisClient,
  ) {}

  send(streamName: string, data: string) {
    this._redisClient.xadd(streamName, '*', 'data', data);
  }
}
