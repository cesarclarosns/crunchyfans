import { InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { FlowProducer } from 'bullmq';

@Injectable()
export class UserSignedIProducer {
  constructor(
    @InjectFlowProducer() private readonly flowProducer: FlowProducer,
  ) {}

  async sendMessage() {
    await this.flowProducer.addBulk([{ name: '', queueName: '' }]);
  }
}
