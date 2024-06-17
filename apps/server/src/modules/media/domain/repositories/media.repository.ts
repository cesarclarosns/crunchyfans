import { IUnitOfWork } from '@/common/domain/repositories/unit-of-work.factory';

import { CreateMediaDto } from '../dtos/create-media.dto';
import { GetMediasDto } from '../dtos/get-medias.dto';
import { UpdateMediaDto } from '../dtos/update-media.dto';
import { Media } from '../entities/media';

export interface IMediaRepository {
  createMedia: (create: CreateMediaDto, uow: IUnitOfWork) => Promise<Media>;

  getMediaById: (mediaId: string) => Promise<Media | null>;

  getMedias: (filter: GetMediasDto) => Promise<Media[]>;

  updateMedia: (
    mediaId: string,
    update: UpdateMediaDto,
    uow: IUnitOfWork,
  ) => Promise<Media | null>;

  deleteMedia: (mediaId: string, uow: IUnitOfWork) => Promise<Media | null>;
}

export const IMediaRepository = Symbol('IMediaRepository');
