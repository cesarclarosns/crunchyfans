import { Module } from '@nestjs/common';

import { NotificationsService } from '@/modules/notifications/application/services/notifications.service';
import { NotificationsController } from '@/modules/notifications/presentation/controllers/notifications.controller';

@Module({
  controllers: [NotificationsController],
  exports: [NotificationsService],
  providers: [NotificationsService],
})
export class NotificationsModule {}
