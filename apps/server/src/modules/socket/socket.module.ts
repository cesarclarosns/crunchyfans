import { Module } from '@nestjs/common';

import { ChatsModule } from '../chats/chats.module';
import { UsersModule } from '../users/users.module';
import { ChatsGateway } from './presentation/gateways/chats.gateway';
import { NotificationsGateway } from './presentation/gateways/notifications.gateway';
import { UsersGateway } from './presentation/gateways/users.gateway';

@Module({
  imports: [UsersModule, ChatsModule],
  providers: [UsersGateway, ChatsGateway, NotificationsGateway],
})
export class SocketModule {}
