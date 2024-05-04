import { InjectFlowProducer, InjectQueue } from '@nestjs/bullmq';
import { FlowProducer, Queue } from 'bullmq';

import { QUEUES } from '@/core/queue/domain/queues';
import { TranscodeMediaMessage } from '@/modules/media/domain/messages';

export class TranscodeMediaProducer {
  constructor(
    @InjectFlowProducer() private readonly flowProducer: FlowProducer,
  ) {}

  async execute() {
    await this.flowProducer.addBulk([
      { data: new TranscodeMediaMessage(), name: '', queueName: QUEUES.media },
    ]);
  }
}
