import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { mediaSettings } from '@/config';
import { MediaService } from '@/modules/media/application/services/media.service';
import { StorageService } from '@/modules/media/application/services/storage.service';
import { CreateMediaDto } from '@/modules/media/domain/dtos/create-media.dto';
import { CreateUploadDto } from '@/modules/media/domain/dtos/create-upload.dto';

@Controller('media')
export class MediaController {
  constructor(
    @InjectPinoLogger(MediaController.name)
    private readonly _logger: PinoLogger,
    private readonly _mediaService: MediaService,
    private readonly _storageService: StorageService,
  ) {}

  @Post()
  async createMedia(@Req() req: Request, @Body() body: CreateMediaDto) {
    return await this._mediaService.createMedia(body);
  }

  @Post()
  async createUpload(@Req() req: Request, @Body() body: CreateUploadDto) {
    const uploadUrl = await this._storageService.createUploadUrl({
      bucket: mediaSettings.S3_BUCKET_MEDIA_NAME,
      fileKey: body.fileKey,
    });

    return { url: uploadUrl };
  }
}
