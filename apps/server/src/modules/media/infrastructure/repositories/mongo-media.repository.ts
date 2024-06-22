import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MongoUnitOfWork } from '@/common/infrastructure/repositories/mongo-unit-of-work.factory';
import {
  CreateMediaDto,
  GetMediasDto,
  UpdateMediaDto,
} from '@/modules/media/domain/dtos';
import { Media } from '@/modules/media/domain/entities/media';
import { IMediaRepository } from '@/modules/media/domain/repositories/media.repository';
import { MongoMedia } from '@/modules/media/infrastructure/entities';

@Injectable()
export class MongoMediaRepository implements IMediaRepository {
  constructor(
    @InjectPinoLogger(MongoMediaRepository.name)
    private readonly _logger: PinoLogger,
    @InjectConnection() private readonly _connection: mongoose.Connection,
    @InjectModel(MongoMedia.name)
    private readonly _mediaModel: Model<MongoMedia>,
  ) {}

  async createMedia(
    create: CreateMediaDto,
    uow: MongoUnitOfWork,
  ): Promise<Media> {
    const [_media] = await this._mediaModel.insertMany([create], {
      session: uow.session,
    });

    const media = new Media(_media.toJSON());
    this._logger.debug('createMedia done', media);
    return media;
  }

  async getMedias(filter: GetMediasDto): Promise<Media[]> {
    const _medias = await this._mediaModel.find({
      _id: { $in: filter.ids },
    });

    const medias = _medias.map((_media) => new Media(_media.toJSON()));
    this._logger.debug('getMedias done', medias);
    return medias;
  }

  async getMediaById(mediaId: string): Promise<Media | null> {
    const _media = await this._mediaModel.findOne({ _id: mediaId });
    if (!_media) return null;

    const media = new Media(_media.toJSON());
    this._logger.debug('getMediaById done', media);
    return media;
  }

  async updateMedia(
    mediaId: string,
    update: UpdateMediaDto,
    uow: MongoUnitOfWork,
  ): Promise<Media | null> {
    const _media = await this._mediaModel.findByIdAndUpdate(
      mediaId,
      { $set: update },
      {
        new: true,
        session: uow.session,
      },
    );
    if (!_media) return null;

    const media = new Media(_media.toJSON());
    this._logger.debug({ media }, 'updateMedia done');
    return media;
  }

  async deleteMedia(
    mediaId: string,
    uow: MongoUnitOfWork,
  ): Promise<Media | null> {
    const _media = await this._mediaModel.findByIdAndDelete(mediaId, {
      session: uow.session,
    });
    if (!_media) return null;

    const media = new Media(_media.toJSON());
    this._logger.debug({ media }, 'deleteMedia done');
    return media;
  }
}
