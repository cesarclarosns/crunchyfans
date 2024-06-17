import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { IUnitOfWorkFactory } from '@/common/domain/repositories/unit-of-work.factory';
import { MongoUnitOfWork } from '@/common/infrastructure/repositories/mongo-unit-of-work.factory';
import { mediaSettings } from '@/config';
import { StorageService } from '@/modules/media/application/services/storage.service';
import { CreateMediaDto } from '@/modules/media/domain/dtos/create-media.dto';
import { GetMediasDto } from '@/modules/media/domain/dtos/get-medias.dto';
import { UpdateMediaDto } from '@/modules/media/domain/dtos/update-media.dto';
import { Media } from '@/modules/media/domain/entities/media';

import { IMediaRepository } from '../../domain/repositories/media.repository';

@Injectable()
export class MediaService {
  constructor(
    @InjectPinoLogger(MediaService.name) private readonly _logger: PinoLogger,
    private readonly _eventEmitter: EventEmitter2,
    private readonly _storageService: StorageService,
    @Inject(IMediaRepository)
    private readonly _mediaRepository: IMediaRepository,
    @Inject(IUnitOfWorkFactory)
    private readonly _unitOfWorkFactory: IUnitOfWorkFactory,
  ) {}

  async createMedia(create: CreateMediaDto) {
    const unitOfWork = this._unitOfWorkFactory.create();
    await unitOfWork.start();

    try {
      const media = await this._mediaRepository.createMedia(create, unitOfWork);

      await unitOfWork.commit();

      return media;
    } catch (error) {
      await unitOfWork.rollback();
      throw error;
    }
  }

  async getMedias(filter: GetMediasDto) {
    return await this._mediaRepository.getMedias(filter);
  }

  async getMediaById(mediaId: string) {
    return await this._mediaRepository.getMediaById(mediaId);
  }

  async updateMedia(mediaId: string, update: UpdateMediaDto) {
    const uow = this._unitOfWorkFactory.create();
    await uow.start();

    try {
      const media = await this._mediaRepository.updateMedia(
        mediaId,
        update,
        uow,
      );

      await uow.commit();

      return media;
    } catch (error) {
      await uow.rollback();
      throw error;
    }
  }

  async deleteMedia(mediaId: string) {
    const uow = this._unitOfWorkFactory.create();
    await uow.start();

    try {
      const media = await this._mediaRepository.deleteMedia(mediaId, uow);

      await uow.commit();

      return media;
    } catch (error) {
      await uow.rollback();
      throw error;
    }
  }

  async addDownloadUrlsToMedia(media: Media): Promise<void> {
    const promises: Promise<void>[] = [];

    if (media.source)
      promises.push(
        (async () => {
          media.source = await this._storageService.createDownloadUrl({
            bucket: mediaSettings.S3_BUCKET_MEDIA_NAME,
            fileKey: media.source,
          });
        })(),
      );

    if (media.thubmnail)
      promises.push(
        (async () => {
          media.thubmnail = await this._storageService.createDownloadUrl({
            bucket: mediaSettings.S3_BUCKET_MEDIA_NAME,
            fileKey: media.thubmnail,
          });
        })(),
      );

    if (media.preview)
      promises.push(
        (async () => {
          media.preview = await this._storageService.createDownloadUrl({
            bucket: mediaSettings.S3_BUCKET_MEDIA_NAME,
            fileKey: media.preview,
          });
        })(),
      );

    if (media.sources) {
      Object.keys(media.sources).forEach((key) => {
        promises.push(
          (async () => {
            media.sources[key] = await this._storageService.createDownloadUrl({
              bucket: mediaSettings.S3_BUCKET_MEDIA_NAME,
              fileKey: media.sources[key],
            });
          })(),
        );
      });
    }

    await Promise.all(promises);
  }
}
