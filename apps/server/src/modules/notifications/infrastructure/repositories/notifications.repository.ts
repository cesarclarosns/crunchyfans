import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectPinoLogger(NotificationsRepository.name)
    private readonly _logger: PinoLogger,
  ) {}

  async createNotification() {}
  async updateNotification() {}
  async getNotificationById() {}
  async getNotificationsByUserId(userId: string, filter: any) {}
  async deleteNotification(id: string) {}
}
