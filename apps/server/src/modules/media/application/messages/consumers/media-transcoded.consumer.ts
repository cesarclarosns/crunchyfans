import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { QUEUES } from '@/core/queue/domain/queues';

@Processor(QUEUES.media)
export class MediaTranscodedConsumer extends WorkerHost {
  async process(
    job: Job<any, any, string>,
    token?: string | undefined,
  ): Promise<any> {}

  @OnWorkerEvent('completed')
  onCompleted() {}
}
