import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { EMAIL_JOBS, EMAIL_QUEUE } from '@/modules/email/domain/jobs';

@Processor(EMAIL_QUEUE)
export class SendEmailSignInWithCodeConsumer {
  constructor(
    @InjectPinoLogger(SendEmailSignInWithCodeConsumer.name)
    private readonly logger: PinoLogger,
  ) {}

  @Process(EMAIL_JOBS.sendEmailSignInWithCode)
  async process(job: Job<unknown>) {
    this.logger.debug(job);
  }
}
