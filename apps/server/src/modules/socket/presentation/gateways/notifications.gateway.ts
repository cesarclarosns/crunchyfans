import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import {
  CustomServer,
  CustomSocket,
} from '@/modules/socket/domain/types/socket';

@WebSocketGateway()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: CustomServer;

  handleConnection(socket: CustomSocket) {
    console.log(socket.id);
  }

  handleDisconnect(socket: CustomSocket) {
    console.log(socket.id);
  }

  // @OnEvent(NOTIFICATIONS_EVENTS.notificationCreated)
  // handleOnNotificationCreatedEvent(
  //   notificationCreatedEvent: NotificationCreatedEvent,
  // ) {
  //   // this.server
  //   //   .to(`users:${notificationCreatedEvent.user_id}`)
  //   //   .emit('notifications/new-notification', {
  //   //     notification: notificationCreatedEvent.notification,
  //   //   });
  // }
}
