import { OnEvent } from '@nestjs/event-emitter';
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
import { ChatsService } from '@/features/chats/chats.service';
import { ChatMessageCreatedEvent, CHATS_EVENTS } from '@/features/chats/events';

@WebSocketGateway()
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: CustomServer;

  constructor(private readonly chatsService: ChatsService) {}

  handleConnection(socket: CustomSocket) {}

  handleDisconnect(socket: CustomSocket) {}

  @SubscribeMessage<keyof ClientToServerEvents>('chats/join-chat')
  async handleJoinChat(
    socket: CustomSocket,
    payload: EventPayload<ClientToServerEvents['chats/join-chat']>,
  ): Promise<CallbackResponse<ClientToServerEvents['chats/join-chat']>> {
    const userId = socket.data.sub;
    const chatId = payload.chatId;

    socket.join(`chats:${chatId}`);

    return { message: [], payload: null, status: 'success' };
  }

  @SubscribeMessage<keyof ClientToServerEvents>('chats/user-typing')
  async handleUserTyping(
    socket: CustomSocket,
    payload: EventPayload<ClientToServerEvents['chats/user-typing']>,
  ): Promise<CallbackResponse<ClientToServerEvents['chats/user-typing']>> {
    const userId = socket.data.sub;
    const { chatId } = payload;

    this.server
      .to(`chats:${chatId}`)
      .emit('chats/user-typing', { chatId, userId });

    return { message: [], payload: null, status: 'success' };
  }

  @OnEvent(CHATS_EVENTS.ChatMessageCreated)
  async handleChatMessageCreatedEvent(payload: ChatMessageCreatedEvent) {
    const { chatId, messageId } = payload;

    const [chat, message] = await Promise.all([
      this.chatsService.findOneById(chatId),
      this.chatsService.findOneMessageById(messageId),
    ]);

    this.server
      .to(`chats:${chatId}`)
      .emit('chats/new-message', { chatId, message });

    chat.message = message;

    this.server
      .to(chat.participants.map((user) => `users:${user._id}`))
      .emit('chats/new-chat', { chat, chatId: chat._id });
  }
}
