import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import {
  CallbackResponse,
  ClientToServerEvents,
  CustomServer,
  CustomSocket,
  EventPayload,
} from '@/common/interfaces/socket';

@WebSocketGateway()
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: CustomServer;

  handleConnection(socket: CustomSocket) {
    const userId = socket.data.sub;
    socket.join(`users:${userId}`);
  }

  handleDisconnect(socket: CustomSocket) {}

  @SubscribeMessage<keyof ClientToServerEvents>('users/get-status')
  async handleGetStatus(
    socket: CustomSocket,
    payload: EventPayload<ClientToServerEvents['users/get-status']>,
  ): Promise<CallbackResponse<ClientToServerEvents['users/get-status']>> {
    try {
      const online: string[] = [];
      const offline: string[] = [];

      await Promise.all(
        payload.users.map(async (user_id) => {
          const sockets = await this.server
            .in(`users:${user_id}`)
            .fetchSockets();

          if (!!sockets.length) {
            online.push(user_id);
          } else {
            offline.push(user_id);
          }
        }),
      );

      return {
        message: [],
        payload: {
          offline,
          online,
        },
        status: 'success',
      };
    } catch (err) {
      return {
        errors: {},
        message: [],
        status: 'failed',
      };
    }
  }
}
