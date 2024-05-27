import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaService } from '../application/services/media.service';
import { StorageService } from '../application/services/storage.service';
import { MediaController } from '../presentation/controllers/media.controller';
import { Media, MediaSchema } from './repositories/entities/media.entity';
import { MediaRepository } from './repositories/media.repository';

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
