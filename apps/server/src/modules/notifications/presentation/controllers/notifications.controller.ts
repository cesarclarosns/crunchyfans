import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { NotificationsService } from '@/modules/notifications/application/services/notifications.service';
import { CreateNotificationDto } from '@/modules/notifications/domain/dtos/create-notification.dto';
import { UpdateNotificationDto } from '@/modules/notifications/domain/dtos/update-notification.dto';

/**
 * POST / create notification
 * GET / get notifications
 * GET /:id get notifications
 * PATCH /:id update notification
 * DELETE /:id delete notification
 * GET /unread
 */

@Controller('notifications')
export class NotificationsController {
  constructor(
    @InjectPinoLogger(NotificationsController.name)
    private readonly _logger: PinoLogger,
    private readonly _notificationsService: NotificationsService,
  ) {}

  @Post()
  createNotification(@Body() body: CreateNotificationDto) {}

  @Get()
  getNotifications() {}

  @Get(':id')
  getNotificationById(@Param('id') id: string) {}

  @Patch(':id')
  updateNotification(
    @Param('id') id: string,
    @Body() body: UpdateNotificationDto,
  ) {}

  @Delete(':id')
  deleteNotification(@Param('id') id: string) {}

  async getUserNotifications() {}
}
