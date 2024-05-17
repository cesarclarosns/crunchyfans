import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';

import { CreateNotificationDto } from '../../domain/dtos/create-notification.dto';
import { UpdateNotificationDto } from '../../domain/dtos/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor() {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
