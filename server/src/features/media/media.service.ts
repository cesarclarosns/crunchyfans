import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { validateEventEmitterAsyncResults } from '@/common/libs/utils';
import { config } from '@/config';

import { CreateMediaDto } from './dto/create-media.dto';
import { CreateMediaParamsDto } from './dto/create-media-params.dto';
import { CreateMultipartUploadDto } from './dto/create-multipart-upload.dto';
import { CreateMultipartUploadQueryDto } from './dto/create-multipart-upload-query.dto';
import { CreateUploadQueryDto } from './dto/create-upload-query.dto';
import { DeleteMultipartUploadDto } from './dto/delete-multipart-upload.dto';
import { MediaDto } from './dto/media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';
import { MEDIA_EVENTS } from './events';
import { MediaCreatedEvent } from './events/media-created.event';
import { TRANSCODING_STATUS } from './media.constants';
import { getMediaTypeFromFileKey } from './media.utils';
import { TranscodeSubmitProducer } from './producers/transcode-submit.producer';
import { StorageService } from './storage.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectPinoLogger(MediaService.name) private readonly logger: PinoLogger,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>,
    private readonly eventEmitter: EventEmitter2,
    private readonly storageService: StorageService,
    private readonly transcodeSubmitProducer: TranscodeSubmitProducer,
  ) {}

  async create(createMediaParamsDto: CreateMediaParamsDto) {
    const { fileKey, userId } = createMediaParamsDto;
    const mediaType = getMediaTypeFromFileKey(fileKey);

    const session = await this.connection.startSession();

    try {
      return await session.withTransaction(async () => {
        const createMediaDto = new CreateMediaDto();
        createMediaDto.userId = userId;
        createMediaDto.mediaType = mediaType;
        createMediaDto.processing = {
          fileKey,
          transcodingStatus: TRANSCODING_STATUS.submit,
        };

        const media = (
          await this.mediaModel.create([createMediaDto], {
            session,
          })
        ).at(0)!;

        return media;
      });
    } catch (err) {
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async findAll(filter: any) {
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
    const bucket = config.STORAGE.S3_BUCKET_MEDIA_PROCESSING;

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
    const bucket = config.STORAGE.S3_BUCKET_MEDIA_PROCESSING;

    // Create multipartUpload
    if (uploads !== undefined) {
      return await this.storageService.createMultipartUpload({
        bucket,
        fileKey,
      });
    }

    // Create uploadPartSignedUrl
    if (!!partNumber && !!uploadId) {
      const url = await this.storageService.createUploadPartSignedUrl({
        bucket,
        fileKey,
        partNumber: +partNumber,
        uploadId,
      });

      return { url };
    }

    // Complete multipartUpload
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
    const bucket = config.STORAGE.S3_BUCKET_MEDIA_PROCESSING;

    return await this.storageService.deleteMultipartUpload({
      bucket,
      fileKey,
      uploadId,
    });
  }

  // Downloads

  async downloadMedia(media: MediaDto) {
    if (media.sources) {
      await Promise.all(
        media.sources.map(async (source) => {
          if (source.fileKey) {
            source.fileUrl = await this.storageService.download(source.fileKey);
          }
        }),
      );
    }

    if (media.thumbnails) {
      await Promise.all(
        media.thumbnails.map(async (thumbnail) => {
          if (thumbnail.fileKey) {
            thumbnail.fileUrl = await this.storageService.download(
              thumbnail.fileKey,
            );
          }
        }),
      );
    }
  }
}
