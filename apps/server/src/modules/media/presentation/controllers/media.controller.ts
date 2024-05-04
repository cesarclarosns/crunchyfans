import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { CreateMediaDto } from '../../domain/dtos/create-media.dto';
import { CreateMediaParamsDto } from '../../domain/dtos/create-media-params.dto';
import { CreateMultipartUploadDto } from '../../domain/dtos/create-multipart-upload.dto';
import { CreateUploadDto } from '../../domain/dtos/create-upload.dto';
import { DeleteMultipartUploadDto } from '../../domain/dtos/delete-multipart-upload.dto';
import { MediaService } from '../../application/services/media.service';

/**
 * POST /media
 * POST /upload
 * POST /multipart-upload
 * DELETE /multipart-upload
 */

@Controller('media')
export class MediaController {
  constructor(
    @InjectPinoLogger(MediaController.name) private readonly logger: PinoLogger,
    private readonly mediaService: MediaService,
  ) {}

  @Post()
  async create(@Req() req: Request, @Body() body: CreateMediaParamsDto) {
    const userId = req.user.sub;

    body.userId = userId;

    return await this.mediaService.create(body);
  }

  @Get()
  async findAll(@Req() req: Request) {
    return req;
  }

  @Post('upload')
  async createUpload(@Body() body: CreateUploadDto) {
    return await this.mediaService.createUpload(body);
  }

  @Post('multipart-upload')
  async createMulitpartUpload(@Body() body: CreateMultipartUploadDto) {
    return await this.mediaService.createMultipartUpload(body);
  }

  @Delete('multipart-upload')
  async deleteMultipartUpload(@Query() query: DeleteMultipartUploadDto) {
    return await this.mediaService.deleteMultipartUpload(query);
  }
}
