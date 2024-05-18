import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { settings } from '@/config/settings';
import { StorageService } from '@/modules/media/application/services/storage.service';
import { CreateMediaDto } from '@/modules/media/domain/dtos/create-media.dto';
import { GetMediasDto } from '@/modules/media/domain/dtos/get-medias.dto';
import { UpdateMediaDto } from '@/modules/media/domain/dtos/update-media.dto';
import { Media } from '@/modules/media/domain/models/media.model';
import { MediaRepository } from '@/modules/media/infrastructure/repositories/media.repository';

import { MEDIA_EVENTS, MediaCreatedEvent } from '../../domain/events';

@Injectable()
export class MediaService {
  constructor(
    @InjectPinoLogger(MediaService.name) private readonly logger: PinoLogger,
    private readonly eventEmitter: EventEmitter2,
    private readonly storageService: StorageService,
    private readonly mediaRepository: MediaRepository,
  ) {}

  async createMedia(create: CreateMediaDto) {
    const media = await this.mediaRepository.createMedia(create);

    this.eventEmitter.emit(
      MEDIA_EVENTS.mediaCreated,
      new MediaCreatedEvent({ mediaId: media.id }),
    );

    return media;
  }

  async getMedias(filter: GetMediasDto) {
    return await this.mediaRepository.getMedias(filter);
  }

  async getMediaById(mediaId: string) {
    return await this.mediaRepository.getMediaById(mediaId);
  }

  async updateMedia(mediaId: string, update: UpdateMediaDto) {
    return await this.mediaRepository.updateMedia(mediaId, update);
  }

  async deleteMedia(mediaId: string) {
    return await this.mediaRepository.deleteMedia(mediaId);
  }

  async addDownloadUrlsToMedia(media: Media) {
    const promises: Promise<void>[] = [];

    if (media.source)
      promises.push(
        (async () => {
          media.source = await this.storageService.createDownloadUrl({
            bucket: settings.MEDIA.S3_BUCKET_MEDIA_NAME,
            fileKey: media.source,
          });
        })(),
      );

    if (media.thubmnail)
      promises.push(
        (async () => {
          media.thubmnail = await this.storageService.createDownloadUrl({
            bucket: settings.MEDIA.S3_BUCKET_MEDIA_NAME,
            fileKey: media.thubmnail,
          });
        })(),
      );

    if (media.preview)
      promises.push(
        (async () => {
          media.preview = await this.storageService.createDownloadUrl({
            bucket: settings.MEDIA.S3_BUCKET_MEDIA_NAME,
            fileKey: media.preview,
          });
        })(),
      );

    if (media.sources) {
      Object.keys(media.sources).forEach((key) => {
        promises.push(
          (async () => {
            media.sources[key] = await this.storageService.createDownloadUrl({
              bucket: settings.MEDIA.S3_BUCKET_MEDIA_NAME,
              fileKey: media.sources[key],
            });
          })(),
        );
      });
    }

    await Promise.all(promises);
  }
}
