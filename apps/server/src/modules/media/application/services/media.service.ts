import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { settings } from '@/config/settings';

import { CreateMediaDto } from '../../domain/dtos/create-media.dto';
import { CreateMediaParamsDto } from '../../domain/dtos/create-media-params.dto';
import { CreateMultipartUploadDto } from '../../domain/dtos/create-multipart-upload.dto';
import { CreateUploadDto } from '../../domain/dtos/create-upload.dto';
import { DeleteMultipartUploadDto } from '../../domain/dtos/delete-multipart-upload.dto';
import { FindAllMediasDto } from '../../domain/dtos/get-medias.dto';
import { MediaDto } from '../../domain/dtos/media.dto';
import { UpdateMediaDto } from '../../domain/dtos/update-media.dto';
import { TranscodingStatus } from '../../domain/types/transcoding-status';
import { Media } from '../../infrastructure/entities/media.entity';
import { getMediaTypeFromFileKey } from '../libs/utils';
import { StorageService } from './storage.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectPinoLogger(MediaService.name) private readonly logger: PinoLogger,

    private readonly eventEmitter: EventEmitter2,
    private readonly storageService: StorageService,
    // private readonly transcodeMediaSubmitProducer: TranscodeMediaSubmitProducer,
  ) {}

  async create({ fileKey, userId, options }: CreateMediaParamsDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const mediaType = getMediaTypeFromFileKey(fileKey);
      if (!mediaType) throw new BadRequestException('Invalid file');

      const documents = await this.mediaModel.create(
        [
          new CreateMediaDto({
            transcodingStatus: 'submitted',
            type: mediaType,
            userId,
          }),
        ],
        {
          session,
        },
      );
      const document = documents[0];

      const media = new MediaDto(document.toJSON());

      // await this.transcodeMediaSubmitProducer.send({
      //   fileKey: createMediaDto.fileKey,
      //   id: media.id,
      //   options: {
      //     needsThumbnail: createMediaDto.options.needsThumbnail,
      //     needsWatermark: createMediaDto.options.needsWatermark,
      //     watermarkText: createMediaDto.options.watermarkText,
      //   },
      // });

      await session.commitTransaction();

      return media;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async findAll(findAllMediaDto: FindAllMediasDto): Promise<MediaDto[]> {
    const documents = await this.mediaModel.find({
      _id: { $in: findAllMediaDto.ids },
    });

    const medias = documents.map((document) => new MediaDto(document.toJSON()));
    return medias;
  }

  async findOneById(id: string): Promise<MediaDto | null> {
    const document = await this.mediaModel.findById(id);
    if (!document) return null;

    const media = new MediaDto(document.toJSON());
    return media;
  }

  async update(
    id: string,
    updateMediaDto: UpdateMediaDto,
  ): Promise<MediaDto | null> {
    const document = await this.mediaModel.findOneAndUpdate(
      { _id: id },
      {
        $set: updateMediaDto,
      },
    );
    if (!document) return null;

    const media = new MediaDto(document.toJSON());
    return media;
  }

  async createUpload(createUploadDto: CreateUploadDto) {
    const bucket = settings.MEDIA.S3_BUCKET_MEDIA_PROCESSING_NAME;

    const url = await this.storageService.createUploadUrl({
      bucket,
      fileKey: createUploadDto.fileKey,
    });

    return { url };
  }

  async createMultipartUpload({
    parts,
    uploads,
    uploadId,
    partNumber,
    fileKey,
  }: CreateMultipartUploadDto) {
    const bucket = settings.MEDIA.S3_BUCKET_MEDIA_PROCESSING_NAME;

    if (uploads) {
      return await this.storageService.createMultipartUpload({
        bucket,
        fileKey,
      });
    }

    if (!!partNumber && !!uploadId) {
      const url = await this.storageService.createMultipartUploadPartUrl({
        bucket,
        fileKey,
        partNumber: +partNumber,
        uploadId,
      });

      return { url };
    }

    if (!!uploadId && !!parts) {
      return await this.storageService.completeMultipartUpload({
        bucket,
        fileKey,
        parts,
        uploadId,
      });
    }

    throw new BadRequestException('Invalid query params');
  }

  async deleteMultipartUpload({ fileKey, uploadId }: DeleteMultipartUploadDto) {
    const bucket = settings.MEDIA.S3_BUCKET_MEDIA_PROCESSING_NAME;

    return await this.storageService.deleteMultipartUpload({
      bucket,
      fileKey,
      uploadId,
    });
  }
}
