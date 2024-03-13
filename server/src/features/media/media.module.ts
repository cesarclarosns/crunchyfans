import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TranscodeCompleteConsumer } from './consumers/transcode-complete.consumer';
import { Media, MediaSchema } from './entities/media.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { TranscodeSubmitProducer } from './producers/transcode-submit.producer';
import { StorageService } from './storage.service';

@Module({
  controllers: [MediaController],
  exports: [MediaService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Media.name,
        schema: MediaSchema,
      },
    ]),
  ],
  providers: [
    MediaService,
    StorageService,
    // Producers
    TranscodeSubmitProducer,
    // Consumers
    TranscodeCompleteConsumer,
  ],
})
export class MediaModule {}
