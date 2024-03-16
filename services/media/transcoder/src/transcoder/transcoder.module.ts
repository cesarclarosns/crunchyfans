import { Module } from '@nestjs/common';

import { TranscodeSubmitConsumer } from './consumers/transcode-submit.consumer';
import { TranscodeCompleteProducer } from './producers/transcode-complete.producer';
import { StorageService } from './storage.service';
import { TranscoderService } from './transcoder.service';

@Module({
  imports: [],
  providers: [
    StorageService,
    TranscoderService,
    // Consumers
    TranscodeSubmitConsumer,
    // Producers
    TranscodeCompleteProducer,
  ],
})
export class TranscoderModule {}
