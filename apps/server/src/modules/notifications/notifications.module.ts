import { Module } from '@nestjs/common';

import { NotificationsController } from './infrastructure/controllers/notifications.controller';

@Module({
  controllers: [NotificationsController],
  exports: [],
  providers: [],
})
export class NotificationsModule {}
