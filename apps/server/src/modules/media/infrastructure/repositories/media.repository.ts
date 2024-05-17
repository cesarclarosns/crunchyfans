import { Inject } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { CreateMediaDto } from '../../domain/dtos/create-media.dto';
import { GetMediasDto } from '../../domain/dtos/get-medias.dto';
import { UpdateMediaDto } from '../../domain/dtos/update-media.dto';
import { Media } from '../../domain/models/media.model';

export class MediaRepository {
  constructor(
    @InjectPinoLogger(MediaRepository.name)
    private readonly logger: PinoLogger,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>,
  ) {}

  async createMedia(create: CreateMediaDto): Promise<Media> {
    const document = await this.mediaModel.create(create);

    const media = new Media(document.toJSON());
    return media;
  }

  async getMedias(filter: GetMediasDto): Promise<Media[]> {
    const documents = await this.mediaModel.find({ _id: { $in: filter.ids } });

    const medias = documents.map((document) => new Media(document.toJSON()));
    return medias;
  }

  async getMediaById(mediaId: string): Promise<Media | null> {
    const document = await this.mediaModel.findOne({ _id: mediaId });
    if (!document) return null;

    const media = new Media(document.toJSON());
    return media;
  }

  async updateMedia(
    mediaId: string,
    update: UpdateMediaDto,
  ): Promise<Media | null> {
    const document = await this.mediaModel.findByIdAndUpdate(
      mediaId,
      { $set: update },
      {
        new: true,
      },
    );
    if (!document) return null;

    const media = new Media(document.toJSON());
    return media;
  }

  async deleteMedia(mediaId: string): Promise<Media | null> {
    const document = await this.mediaModel.findByIdAndDelete(mediaId);
    if (!document) return null;

    const media = new Media(document.toJSON());
    return media;
  }
}
