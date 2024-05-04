import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { EMAIL_JOBS, EMAIL_QUEUE } from '@/modules/email/domain/jobs';

@Processor(EMAIL_QUEUE)
export class SendEmailSignUpConsumer {
  constructor() {}

  @Process(EMAIL_JOBS.sendEmailSignUp)
  async process(job: Job<unknown>) {}
}
