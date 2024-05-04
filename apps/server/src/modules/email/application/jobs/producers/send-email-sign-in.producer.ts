import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class SendSignUpEmailProducer {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async execute() {
    const job = await this.emailQueue.add('sendSignUpEmail', {}, {});
  }
}
