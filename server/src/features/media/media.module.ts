import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SnsModule } from '@/providers/sns/sns.module';

import { TranscodeMediaCompleteConsumer } from './consumers/transcode-media-complete.consumer';
import { Media, MediaSchema } from './entities/media.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { TranscodeMediaSubmitProducer } from './producers/transcode-media-submit.producer';
import { StorageService } from './storage.service';

@Module({
  controllers: [MediaController],
  exports: [MediaService, StorageService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Media.name,
        schema: MediaSchema,
      },
    ]),
    SnsModule,
  ],
  providers: [
    MediaService,
    StorageService,
    // Producers
    TranscodeMediaSubmitProducer,
    // Consumers
    TranscodeMediaCompleteConsumer,
  ],
})
export class MediaModule {}
