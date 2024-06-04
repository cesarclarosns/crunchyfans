import { Processor } from '@nestjs/bullmq';
import { Inject, OnModuleInit } from '@nestjs/common';
import { Job } from 'bullmq';
import { CommonRedisOptions } from 'ioredis';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { RedisClient } from '@/core/redis/redis.module';
// import {} from '';
import { EMAIL_JOBS } from '@/modules/email/domain/jobs';

@Processor(EMAIL_JOBS.sendEmailSuccessfullSignIn)
export class SendEmailSuccessfullSignInConsumer implements OnModuleInit {
  constructor(
    @InjectPinoLogger(SendEmailSuccessfullSignInConsumer.name)
    private readonly _logger: PinoLogger,
    @Inject(RedisClient) private readonly _redisClient: RedisClient,
  ) {}

  onModuleInit() {}
}
