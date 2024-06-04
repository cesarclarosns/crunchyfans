import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaService } from './application/services/media.service';
import { StorageService } from './application/services/storage.service';
import {
  Media,
  MediaSchema,
} from './infrastructure/repositories/entities/media.entity';
import { MediaRepository } from './infrastructure/repositories/media.repository';
import { MediaController } from './presentation/controllers/media.controller';

@Module({
  controllers: [MediaController],
  exports: [MongooseModule, MediaService, StorageService, MediaRepository],
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
    MediaRepository,
    // TranscodeMediaSubmitProducer,
    // TranscodeMediaCompleteConsumer,
  ],
})
export class MediaModule {}
