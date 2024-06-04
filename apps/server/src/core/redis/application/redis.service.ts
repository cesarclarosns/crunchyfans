import { Injectable, OnModuleInit } from '@nestjs/common';

import { RedisClient } from '../redis.module';

export interface IEventConsumer {
  start: () => void;
  stop: () => void;
}

export interface IEventProducer {
  send: (ev: unknown) => Promise<unknown>;
}

export class RedisEventConsumer implements IEventConsumer, OnModuleInit {
  start() {}
  stop() {}

  onModuleInit() {}
}

export class RedisEventProducer implements IEventProducer {
  send: (...args: any[]) => Promise<unknown>;
}

@Injectable()
export class RedisService {}

export class Consumer {
  client: RedisClient;
  consumerGroupName: string;
  consumerName: string;
  streamName: string;
  deadLetterStreamName: string;
  maxRetries: number;
  batchSize: number;
  blockTimeMs: number;

  readMessages() {
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

  readPendingMessages() {
    this.client.xpending('', this.consumerGroupName, 'IDLE', 1, 1);
  }

  acknowledge(...messageIds: string[]) {
    this.client.xack('', '', ...messageIds);
  }

  moveToDeadLetterQueue() {
    this.client.xdel('');
    this.client.xadd('');
  }
}

/**
 *  users:user_created
 *
 *
 *
 */
