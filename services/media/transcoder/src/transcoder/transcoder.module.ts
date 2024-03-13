import { Module } from '@nestjs/common';

import { TranscodeSubmitConsumer } from './consumers/transcode-submit.consumer';
import { TranscodeCompleteProducer } from './producers/transcode-complete.producer';

@Module({
  imports: [],
  providers: [
    // Consumers
    TranscodeSubmitConsumer,
    // Producers
    TranscodeCompleteProducer,
  ],
})
export class TranscoderModule {}
