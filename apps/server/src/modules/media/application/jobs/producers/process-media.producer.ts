import { InjectFlowProducer, InjectQueue } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FlowProducer, Queue } from 'bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MEDIA_EVENTS, MediaCreatedEvent } from '@/modules/media/domain/events';
import {
  MEDIA_JOBS,
  ProcessMediaJob,
  TranscodeMediaJob,
} from '@/modules/media/domain/jobs';
import { MediaRepository } from '@/modules/media/infrastructure/repositories/media.repository';

export class ProcessMediaProducer {
  constructor(
    @InjectPinoLogger(ProcessMediaProducer.name)
    private readonly logger: PinoLogger,
    @InjectFlowProducer()
    private readonly flowProducer: FlowProducer,
    private readonly mediaRepository: MediaRepository,
  ) {}

  @OnEvent(MEDIA_EVENTS.mediaCreated)
  async execute(ev: MediaCreatedEvent) {
    const media = await this.mediaRepository.getMediaById(ev.mediaId);
    if (!media) return;

    const jobNode = await this.flowProducer.add({
      children: [
        {
          data: new TranscodeMediaJob({
            type: media.type,
            ...media.processing,
          }),
          name: MEDIA_JOBS.transcodeMedia,
          queueName: MEDIA_JOBS.transcodeMedia,
        },
      ],
      data: new ProcessMediaJob({ mediaId: media.id }),
      name: MEDIA_JOBS.processMedia,
      queueName: MEDIA_JOBS.processMedia,
    });

    this.logger.debug('execute', jobNode);
  }
}
