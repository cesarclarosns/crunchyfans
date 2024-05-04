import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import {
  CHATS_EVENTS,
  MessageCreatedEvent,
} from '@/modules/chats/application/events';
import { MessageReadEvent } from '@/modules/chats/application/events/message-read.event';
import { ChatsService } from '@/modules/chats/chats.service';

import {
  CallbackResponse,
  ClientToServerEvents,
  CustomServer,
  CustomSocket,
  EventPayload,
} from '../../domain/types/socket';

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
    const chatId = payload.chatId;

    socket.join(`chats:${chatId}`);

    return { payload: null, status: 'success' };
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

    return { payload: null, status: 'success' };
  }

  @OnEvent(CHATS_EVENTS.MessageCreated)
  async handleChatMessageCreatedEvent(payload: MessageCreatedEvent) {
    const [chat, message] = await Promise.all([
      this.chatsService.findOneChatById(payload.chatId),
      this.chatsService.findOneMessageById(payload.messageId),
    ]);

    if (chat && message) {
      chat.lastMessage = message;

      this.server
        .to(chat.participants.map((userId) => `users:${userId}`))
        .emit('chats/new-message', { chat, message });
    }
  }

  @OnEvent(CHATS_EVENTS.MessageRead)
  async handleChatMessageReadEvent(payload: MessageReadEvent) {
    const chat = await this.chatsService.findOneChatById(payload.chatId);

    if (!chat) return;

    this.server
      .to(chat.participants.map((user) => `users:${user}`))
      .emit('chats/message-read', payload);
  }
}
