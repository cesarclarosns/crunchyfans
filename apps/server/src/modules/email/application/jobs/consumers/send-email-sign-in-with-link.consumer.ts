import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { EMAIL_JOBS } from '@/modules/email/domain/jobs';

@Processor(EMAIL_JOBS.sendEmailSignInWithLink)
export class SendEmailSignInWithLinkConsumer {
  constructor(
    @InjectPinoLogger(SendEmailSignInWithLinkConsumer.name)
    private readonly logger: PinoLogger,
  ) {}

  async process(job: Job<unknown>) {
    this.logger.debug(job);
  }
}
