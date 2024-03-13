import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { CreateMediaParamsDto } from './dto/create-media-params.dto';
import { CreateMultipartUploadDto } from './dto/create-multipart-upload.dto';
import { CreateMultipartUploadQueryDto } from './dto/create-multipart-upload-query.dto';
import { CreateUploadQueryDto } from './dto/create-upload-query.dto';
import { DeleteMultipartUploadDto } from './dto/delete-multipart-upload.dto';
import { FindAllMediaDto } from './dto/find-all-media.dto';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(
    @InjectPinoLogger(MediaController.name) private readonly logger: PinoLogger,
    private readonly mediaService: MediaService,
  ) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createMediaParamsDto: CreateMediaParamsDto,
  ) {
    const userId = req.user.sub;
    createMediaParamsDto.userId = userId;

    return await this.mediaService.create(createMediaParamsDto);
  }

  @Get(':mediaId')
  async findOne(@Param('mediaId') mediaId: string) {
    return await this.mediaService.findOneById(mediaId);
  }

  @Get()
  async findAll(@Query() findAllMediaDto: FindAllMediaDto) {
    return await this.mediaService.findAll(findAllMediaDto);
  }

  @Post('upload')
  async createUpload(@Query() createUploadQueryDto: CreateUploadQueryDto) {
    return await this.mediaService.createUpload(createUploadQueryDto);
  }

  @Post('multipart-upload')
  async createMulitpartUpload(
    @Body() createMultipartUploadDto: CreateMultipartUploadDto,
    @Query() createMultipartUploadQueryDto: CreateMultipartUploadQueryDto,
  ) {
    return await this.mediaService.createMultipartUpload(
      createMultipartUploadQueryDto,
      createMultipartUploadDto,
    );
  }

  @Delete('multipart-upload')
  async deleteMultipartUpload(
    @Query() deleteUploadQueryDto: DeleteMultipartUploadDto,
  ) {
    return await this.mediaService.deleteMultipartUpload(deleteUploadQueryDto);
  }
}
