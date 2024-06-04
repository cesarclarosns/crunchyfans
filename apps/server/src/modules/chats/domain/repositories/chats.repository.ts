import { IUnitOfWork } from '@/common/domain/repositories/unit-of-work.factory';
import { CreateChatDto } from '@/modules/chats/domain/dtos/create-chat.dto';
import { CreateMessageDto } from '@/modules/chats/domain/dtos/create-message.dto';
import { GetChatsDto } from '@/modules/chats/domain/dtos/get-chats.dto';
import { GetMessagesDto } from '@/modules/chats/domain/dtos/get-messages.dto';
import { UpdateMessageDto } from '@/modules/chats/domain/dtos/update-message.dto';
import {
  Chat,
  ChatWithViewerData,
  Message,
  UserChat,
  UserMessage,
} from '@/modules/chats/domain/models';
import { MessageWithViewerData } from '@/modules/chats/domain/models/message.model';

export interface IChatsRepository {
  createChat: (create: CreateChatDto, uow: IUnitOfWork) => Promise<Chat>;
  getChatsWithViewerData: (
    filter: GetChatsDto,
    viewerId: string,
  ) => Promise<ChatWithViewerData[]>;
  getChatById: (chatId: string) => Promise<Chat | null>;
  getChatWithViewerDataById: (
    chatId: string,
    viewerId: string,
  ) => Promise<ChatWithViewerData | null>;
  deleteChat: (chatId: string, userId: string) => Promise<UserChat | null>;
  createMessage: (
    create: CreateMessageDto,
    uow: IUnitOfWork,
  ) => Promise<Message>;
  getMessagesWithViewerData: (
    filter: GetMessagesDto,
    viewerId: string,
  ) => Promise<MessageWithViewerData[]>;
  getMessageById: (messageId: string) => Promise<Message | null>;
  getMessageWithViewerDataById: (
    messageId: string,
    viewerId: string,
  ) => Promise<MessageWithViewerData | null>;
  updateMessage: (
    messageId: string,
    update: UpdateMessageDto,
  ) => Promise<Message | null>;
  deleteMessage: (messageId: string) => Promise<Message | null>;
  setMessageAsRead: (
    messageId: string,
    userId: string,
    uow: IUnitOfWork,
  ) => Promise<UserChat | null>;
  unsetMessageAsRead: (
    messageId: string,
    userId: string,
    uow: IUnitOfWork,
  ) => Promise<UserChat | null>;
  setMessageAsPurchased: (
    messageId: string,
    userId: string,
    uow: IUnitOfWork,
  ) => Promise<UserMessage | null>;
  unsetMessageAsPurchased: (
    messageId: string,
    userId: string,
    uow: IUnitOfWork,
  ) => Promise<UserMessage | null>;
}

export const IChatsRepository = Symbol('IChatsRepository');
