import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { QUEUES } from '@/core/queue/domain/queues';

@Processor(QUEUES.socket, { name: CHATS_EVENTS })
export class MessageCreatedConsumer extends WorkerHost {
  async process(
    job: Job<any, any, string>,
    token?: string | undefined,
  ): Promise<any> {}
}
