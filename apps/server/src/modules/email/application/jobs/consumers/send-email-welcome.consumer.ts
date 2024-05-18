import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { EMAIL_JOBS } from '@/modules/email/domain/jobs';

@Processor(EMAIL_JOBS.sendEmailWelcome)
export class SendEmailWelcomeConsumer {
  constructor(
    @InjectPinoLogger(SendEmailWelcomeConsumer.name)
    private readonly _logger: PinoLogger,
  ) {}

  async process(job: Job<unknown>) {}
}
