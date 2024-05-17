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

import { MediaService } from '../../application/services/media.service';
import { CreateMediaDto } from '../../domain/dtos/create-media.dto';
import { CreateMediaParamsDto } from '../../domain/dtos/create-media-params.dto';

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
}
