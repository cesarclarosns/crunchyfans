import { InjectQueue } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { EMAIL_JOBS, SendEmailWelcomeJob } from '@/modules/email/domain/jobs';
import { UsersService } from '@/modules/users/application/services/users.service';
import { UserCreatedEvent, USERS_EVENTS } from '@/modules/users/domain/events';

export class SendEmailWelcomeProducer {
  constructor(
    @InjectPinoLogger(SendEmailWelcomeProducer.name)
    private readonly _logger: PinoLogger,
    @InjectQueue(EMAIL_JOBS.sendEmailWelcome)
    private readonly _queue: Queue,
    private readonly _usersService: UsersService,
  ) {}

  @OnEvent(USERS_EVENTS.userCreated)
  async execute(ev: UserCreatedEvent) {
    const user = await this._usersService.getUserById(ev.userId);
    if (!user) return;

    const job = await this._queue.add(
      EMAIL_JOBS.sendEmailWelcome,
      new SendEmailWelcomeJob(user.email),
    );

    this._logger.debug(job);
  }
}
