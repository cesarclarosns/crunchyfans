import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import {
  AUTH_EVENTS,
  UserRequestedLinkToSignInEvent,
} from '@/modules/auth/domain/events';
import {
  EMAIL_JOBS,
  SendEmailSignInWithLinkJob,
} from '@/modules/email/domain/jobs';

@Injectable()
export class SendEmailSignInWithLinkProducer {
  constructor(
    @InjectPinoLogger(SendEmailSignInWithLinkProducer.name)
    private readonly logger: PinoLogger,
    @InjectQueue(EMAIL_JOBS.sendEmailSignInWithLink)
    private readonly queue: Queue,
  ) {}

  @OnEvent(AUTH_EVENTS.userRequestedLinkToSignIn)
  async execute(ev: UserRequestedLinkToSignInEvent) {
    const job = await this.queue.add(
      EMAIL_JOBS.sendEmailSignInWithLink,
      new SendEmailSignInWithLinkJob({
        ...ev,
      }),
    );

    this.logger.debug(job);
  }
}
