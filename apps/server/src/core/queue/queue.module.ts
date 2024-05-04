import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { QUEUES } from './domain/queues';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: QUEUES.auth,
    }),
    BullModule.registerQueue({
      name: QUEUES.auth,
    }),
  ],
})
export class QueueModule {}
