import { InjectQueue } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { EMAIL_JOBS, SendEmailWelcomeJob } from '@/modules/email/domain/jobs';
import { UserCreatedEvent, USERS_EVENTS } from '@/modules/users/domain/events';
import { IUsersService } from '@/modules/users/domain/services/users.service';

export class SendEmailWelcomeProducer {
  constructor(
    @InjectPinoLogger(SendEmailWelcomeProducer.name)
    private readonly logger: PinoLogger,
    @InjectQueue(EMAIL_JOBS.sendEmailWelcome)
    private readonly queue: Queue,
    @Inject(IUsersService) private readonly usersService: IUsersService,
  ) {}

  @OnEvent(USERS_EVENTS.userCreated)
  async execute(ev: UserCreatedEvent) {
    const user = await this.usersService.getUserById(ev.userId);
    if (!user) return;

    const job = await this.queue.add(
      EMAIL_JOBS.sendEmailWelcome,
      new SendEmailWelcomeJob(user.email),
    );

    this.logger.debug(job);
  }
}
