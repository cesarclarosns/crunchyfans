import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { CreateMediaDto } from '@/modules/media/domain/dtos/create-media.dto';
import { GetMediasDto } from '@/modules/media/domain/dtos/get-medias.dto';
import { UpdateMediaDto } from '@/modules/media/domain/dtos/update-media.dto';
import { Media } from '@/modules/media/domain/models/media.model';

import { Media as MediaEntity } from './entities/media.entity';

export class MediaRepository {
  constructor(
    @InjectPinoLogger(MediaRepository.name)
    private readonly _logger: PinoLogger,
    @InjectConnection() private readonly _connection: mongoose.Connection,
    @InjectModel(MediaEntity.name)
    private readonly _mediaModel: Model<MediaEntity>,
  ) {}

  async createMedia(create: CreateMediaDto): Promise<Media> {
    const _media = await this._mediaModel.create(create);

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
  ): Promise<Media | null> {
    const _media = await this._mediaModel.findByIdAndUpdate(
      mediaId,
      { $set: update },
      {
        new: true,
      },
    );
    if (!_media) return null;

    const media = new Media(_media.toJSON());
    this._logger.debug('updateMedia done', media);
    return media;
  }

  async deleteMedia(mediaId: string): Promise<Media | null> {
    const _media = await this._mediaModel.findByIdAndDelete(mediaId);
    if (!_media) return null;

    const media = new Media(_media.toJSON());
    this._logger.debug('deleteMedia done', media);
    return media;
  }
}
