import { Module } from '@nestjs/common';

import { NotificationsController } from '../presentation/controllers/notifications.controller';

@Module({
  controllers: [NotificationsController],
  exports: [],
  providers: [],
})
export class NotificationsModule {}
