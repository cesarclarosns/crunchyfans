import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IUnitOfWorkFactory } from '@/common/domain/repositories/unit-of-work.factory';
import { MongoUnitOfWorkFactory } from '@/common/infrastructure/repositories/mongo-unit-of-work.factory';

import { MediaService } from './application/services/media.service';
import { StorageService } from './application/services/storage.service';
import { IMediaRepository } from './domain/repositories/media.repository';
import {
  Media,
  MediaSchema,
} from './infrastructure/repositories/entities/media.entity';
import { MongoMediaRepository } from './infrastructure/repositories/media.repository';
import { MediaController } from './presentation/controllers/media.controller';

@Module({
  controllers: [MediaController],
  exports: [
    MongooseModule,
    MediaService,
    StorageService,
    IUnitOfWorkFactory,
    IMediaRepository,
  ],
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
    { provide: IUnitOfWorkFactory, useClass: MongoUnitOfWorkFactory },
    { provide: IMediaRepository, useClass: MongoMediaRepository },
    // TranscodeMediaSubmitProducer,
    // TranscodeMediaCompleteConsumer,
  ],
})
export class MediaModule {}
