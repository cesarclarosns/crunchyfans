import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { EMAIL_JOBS, EMAIL_QUEUE } from '@/modules/email/domain/jobs';

@Processor(EMAIL_QUEUE)
export class SendEmailSignInConsumer {
  constructor(
    @InjectPinoLogger(SendEmailSignInConsumer.name)
    private readonly logger: PinoLogger,
  ) {}

  @Process(EMAIL_JOBS.sendEmailSignIn)
  async execute(job: Job<any>) {
    console.log(job);
  }
}
