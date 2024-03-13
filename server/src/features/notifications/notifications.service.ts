import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationCreatedEvent, NOTIFICATIONS_EVENTS } from './events';

@Injectable()
export class NotificationsService {
  constructor() {}

  create(createNotificationDto: CreateNotificationDto) {}

  findAll() {}

  findOne(id: string) {}

  update(id: string, updateNotificationDto: UpdateNotificationDto) {}

  remove(id: string) {}

  async getUnreadNotifications(userId: string): Promise<{ count: number }> {
    return { count: 0 };
  }

  @OnEvent(NOTIFICATIONS_EVENTS.notificationCreated)
  handleNotificationsNotificationCreatedEvent(
    payload: NotificationCreatedEvent,
  ) {
    console.log(payload);
  }
}
