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
import { CHATS_EVENTS, MessageCreatedEvent } from '@/features/chats/events';
import { MessageReadEvent } from '@/features/chats/events/message-read.event';

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

  @OnEvent(CHATS_EVENTS.MessageCreated)
  async handleChatMessageCreatedEvent(payload: MessageCreatedEvent) {
    const [chat, message] = await Promise.all([
      this.chatsService.findOneById(payload.chatId),
      this.chatsService.findOneMessageById(payload.messageId),
    ]);

    if (chat && message) {
      chat.lastMessage = message;

      this.server
        .to(chat.participants.map((user) => `users:${user._id}`))
        .emit('chats/new-message', { chat, message });
    }
  }

  @OnEvent(CHATS_EVENTS.MessageRead)
  async handleChatMessageReadEvent(payload: MessageReadEvent) {
    const chat = await this.chatsService.findOneById(payload.chatId);
    if (!chat) return;

    this.server
      .to(chat.participants.map((user) => `users:${user._id}`))
      .emit('chats/message-read', payload);
  }
}
