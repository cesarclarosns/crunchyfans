import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { QUEUES } from '@/core/queue/domain/queues';
import { PostCreatedEvent } from '@/modules/posts/domain/events/post-created.event';

@Processor(QUEUES.timelines, { name: PostCreatedEvent.name })
export class SubscriptonCreatedConsumer extends WorkerHost {
  async process(
    job: Job<any, any, string>,
    token?: string | undefined,
  ): Promise<any> {}
}
