import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { AUTH_EVENTS, UserSignedInEvent } from '@/modules/auth/domain/events';
import {
  EMAIL_JOBS,
  SendEmailSuccesfullSignInJob,
} from '@/modules/email/domain/jobs';

@Injectable()
export class SendEmailSuccessfullSignInProducer {
  constructor(
    @InjectPinoLogger(SendEmailSuccessfullSignInProducer.name)
    private readonly logger: PinoLogger,
    @InjectQueue(EMAIL_JOBS.sendEmailSuccessfullSignIn)
    private readonly queue: Queue,
  ) {}

  @OnEvent(AUTH_EVENTS.userSignedIn)
  async execute(ev: UserSignedInEvent) {
    const job = await this.queue.add(
      EMAIL_JOBS.sendEmailSuccessfullSignIn,
      new SendEmailSuccesfullSignInJob({
        email: ev.email,
        ip: ev.ip,
        timestamp: ev.timestamp,
        userAgent: ev.userAgent,
      }),
    );

    this.logger.debug(job);
  }
}
