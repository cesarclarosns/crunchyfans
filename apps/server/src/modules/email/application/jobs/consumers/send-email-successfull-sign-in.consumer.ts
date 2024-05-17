import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { EMAIL_JOBS } from '@/modules/email/domain/jobs';

@Processor(EMAIL_JOBS.sendEmailSuccessfullSignIn)
export class SendEmailSuccessfullSignInConsumer {
  constructor(
    @InjectPinoLogger(SendEmailSuccessfullSignInConsumer.name)
    private readonly logger: PinoLogger,
  ) {}

  async execute(job: Job<any>) {
    console.log(job);
  }
}
