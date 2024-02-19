import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { config } from '@/config';

import { CreateMediaDto } from './dto/create-media.dto';
import { CreateMediaParamsDto } from './dto/create-media-params.dto';
import { CreateMultipartUploadDto } from './dto/create-multipart-upload.dto';
import { CreateMultipartUploadQueryDto } from './dto/create-multipart-upload-query.dto';
import { CreateUploadQueryDto } from './dto/create-upload-query.dto';
import { DeleteMultipartUploadDto } from './dto/delete-multipart-upload.dto';
import { MediaDto } from './dto/media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media, TMediaFilterQuery } from './entities/media.entity';
import { MEDIA_EVENTS } from './events';
import { MediaCreatedEvent } from './events/media-created.event';
import { FORMAT_QUALITY, TRANSCODING_STATUS } from './media.constants';
import {
  getFileFormatFromFileName,
  getMediaTypeFromFileName,
} from './media.utils';
import { StorageService } from './storage.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>,
    private readonly eventEmitter: EventEmitter2,
    private readonly storageService: StorageService,
  ) {}

  async create(createMediaParamsDto: CreateMediaParamsDto) {
    const { fileKey, userId } = createMediaParamsDto;

    const session = await this.connection.startSession();

    try {
      session.withTransaction(async () => {
        const createMediaDto = new CreateMediaDto();
        createMediaDto._id = new mongoose.Types.ObjectId().toString();
        createMediaDto.userId = userId;
        createMediaDto.mediaType = 'image';
        createMediaDto.processing = {
          fileKey,
          transcodingStatus: TRANSCODING_STATUS.submit,
        };
        createMediaDto.sources = [
          {
            fileKey,
            quality: FORMAT_QUALITY.original,
          },
        ];

        const media = (
          await this.mediaModel.create([createMediaDto], {
            session,
          })
        ).at(0);

        await this.eventEmitter.emitAsync(
          MEDIA_EVENTS.MediaCreated,
          new MediaCreatedEvent({
            fileKey,
            mediaId: media._id.toString(),
          } as any),
        );

        return media;
      });
    } catch (err) {
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async findAll(filter: TMediaFilterQuery) {
    let media: MediaDto[] = await this.mediaModel.find(filter);
    media = JSON.parse(JSON.stringify(media));

    for (const item of media) {
      this.downloadMedia(item);
    }

    return media;
  }

  async findOneById(mediaId: string) {
    const media = await this.mediaModel.findOne({ _id: mediaId });

    if (media) {
      this.downloadMedia(media as any);
    }

    return media;
  }

  async update(mediaId: string, updateMediaDto: UpdateMediaDto) {
    return await this.mediaModel.updateOne(
      { _id: mediaId },
      { $set: updateMediaDto },
    );
  }

  // Uploads
  async createUpload({ fileKey }: CreateUploadQueryDto) {
    const bucket = config.STORAGE.S3_BUCKET_MEDIA;

    const url = await this.storageService.createUploadSignedUrl({
      bucket,
      fileKey,
    });
    return { url };
  }

  async createMultipartUpload(
    { uploadId, uploads, partNumber, fileKey }: CreateMultipartUploadQueryDto,
    { parts }: CreateMultipartUploadDto,
  ) {
    const bucket = config.STORAGE.S3_BUCKET_MEDIA;

    // Create multipartUpload
    if (uploads !== undefined) {
      return await this.storageService.createMultipartUpload({
        bucket,
        fileKey,
      });
    }

    // Create uploadPartSignedUrl
    if (partNumber !== undefined && uploadId !== undefined) {
      const url = await this.storageService.createUploadPartSignedUrl({
        bucket,
        fileKey,
        partNumber: +partNumber,
        uploadId,
      });

      return { url };
    }

    // Complete multipartUpload
    if (uploadId !== undefined) {
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
    const bucket = config.STORAGE.S3_BUCKET_MEDIA;

    return await this.storageService.deleteMultipartUpload({
      bucket,
      fileKey,
      uploadId,
    });
  }

  downloadMedia(media: MediaDto) {
    if (media.sources) {
      for (const source of media.sources) {
        if (source.fileKey)
          source.fileUrl = this.storageService.download(source.fileKey);
      }
    }

    if (media.thumbnails) {
      for (const thumbnail of media.thumbnails) {
        if (thumbnail.fileKey)
          thumbnail.fileUrl = this.storageService.download(thumbnail.fileKey);
      }
    }
  }
}
