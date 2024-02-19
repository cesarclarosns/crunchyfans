import { Module } from '@nestjs/common';

import { ChatsModule } from '../chats/chats.module';
import { UsersModule } from '../users/users.module';
import { ChatsGateway } from './gateways/chats/chats.gateway';
import { NotificationsGateway } from './gateways/notifications/notifications.gateway';
import { UsersGateway } from './gateways/users/users.gateway';

@Module({
  imports: [UsersModule, ChatsModule],
  providers: [UsersGateway, ChatsGateway, NotificationsGateway],
})
export class SocketModule {}
