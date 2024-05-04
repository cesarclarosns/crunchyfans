import { CreateMediaDto } from '../dtos/create-media.dto';
import { GetMediasDto } from '../dtos/get-medias.dto';
import { UpdateMediaDto } from '../dtos/update-media.dto';
import { Media } from '../models/media.model';

export interface IMediaRepository {
  createMedia: (create: CreateMediaDto) => Promise<Media>;

  getMedias: (filter: GetMediasDto) => Promise<Media[]>;

  getMediaById: (mediaId: string) => Promise<Media | null>;

  updateMedia: (
    mediaId: string,
    update: UpdateMediaDto,
  ) => Promise<Media | null>;
}

export const IMediaRepository = Symbol('IMediaRepository');
