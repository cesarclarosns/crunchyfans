import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { EMAIL_JOBS, EMAIL_QUEUE } from '@/modules/email/domain/jobs';

@Injectable()
export class SendEmailSignUpProducer {
  constructor(@InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue) {}

  async execute() {
    const job = await this.emailQueue.add(EMAIL_JOBS.sendEmailSignUp, {}, {});
  }
}
