import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IUnitOfWorkFactory } from '@/common/domain/repositories/unit-of-work.factory';
import { MongoUnitOfWorkFactory } from '@/common/infrastructure/repositories/mongo-unit-of-work.factory';
import {
  MediaService,
  StorageService,
} from '@/modules/media/application/services';
import { IMediaRepository } from '@/modules/media/domain/repositories/media.repository';
import {
  MongoMedia,
  MongoMediaSchema,
} from '@/modules/media/infrastructure/entities';
import { MongoMediaRepository } from '@/modules/media/infrastructure/repositories/mongo-media.repository';
import { MediaController } from '@/modules/media/presentation/controllers/media.controller';

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
        name: MongoMedia.name,
        schema: MongoMediaSchema,
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
