import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MongoDBContext } from '@/common/infrastructure/repositories/mongo-unit-of-work';
import { CreateChatDto } from '@/modules/chats/domain/dtos/create-chat.dto';
import { CreateMessageDto } from '@/modules/chats/domain/dtos/create-message.dto';
import { GetChatsDto } from '@/modules/chats/domain/dtos/get-chats.dto';
import { GetMessagesDto } from '@/modules/chats/domain/dtos/get-messages.dto';
import { UpdateMessageDto } from '@/modules/chats/domain/dtos/update-message.dto';
import {
  Chat as ChatEntity,
  Message as MessageEntity,
  UserChat as UserChatEntity,
  UserMessage as UserMessageEntity,
} from '@/modules/chats/domain/entities';
import {
  Chat,
  ChatWithViewerData,
  Message,
  UserChat,
  UserChatsData,
  UserMessage,
} from '@/modules/chats/domain/models';

export class ChatsRepository {
  constructor(
    @InjectPinoLogger(ChatsRepository.name)
    private readonly _logger: PinoLogger,
    @InjectModel(ChatEntity.name)
    private readonly _chatModel: Model<ChatEntity>,
    @InjectModel(MessageEntity.name)
    private readonly _messageModel: Model<MessageEntity>,
    @InjectModel(UserChatEntity.name)
    private readonly _userChatModel: Model<UserChatEntity>,
    @InjectModel(UserMessageEntity.name)
    private readonly _userMessageModel: Model<UserMessageEntity>,
  ) {}

  async createChat(
    create: CreateChatDto,
    dbContext: MongoDBContext,
  ): Promise<Chat> {
    const [_chat] = await this._chatModel.insertMany([create], {
      session: dbContext.session,
    });

    await this._userChatModel.insertMany(
      create.participants.map((userId) => ({
        chatId: _chat.id,
        userId,
      })),
      {
        session: dbContext.session,
      },
    );

    const chat = new Chat(_chat.toJSON());
    return chat;
  }

  async getChatsWithViewerData(
    filter: GetChatsDto,
    viewerId: string,
  ): Promise<ChatWithViewerData[]> {
    const aggregate = await this._chatModel.aggregate([
      {
        $match: {
          participants: {
            $in: [new mongoose.Types.ObjectId(viewerId)],
          },
        },
      },
      {
        $lookup: {
          as: 'userChat',
          foreignField: 'chatId',
          from: 'userChat',
          localField: '_id',
        },
      },
      {
        $match: {},
      },
      {
        $lookup: {
          as: 'lastMessage',
          foreignField: '_id',
          from: 'message',
          localField: 'lastMessageId',
        },
      },
    ]);

    const chatsWithViewerData: ChatWithViewerData[] = aggregate.map(
      (result) => {
        const chat = JSON.parse(JSON.stringify(result)) as {
          id: string;
          participants: string[];
          lastMessageId: string;
          lastSenderId: string;
          lastMessage: Message;
          userChat: UserChat[];
        };

        const withUser = chat.participants.find(
          (participant) => participant != viewerId,
        )!;

        const isLastMessageRead =
          chat.lastMessage.userId == viewerId ||
          !!chat.userChat.find(
            (userChat) => userChat.lastReadMessageId == chat.lastMessageId,
          );

        return new ChatWithViewerData({
          id: chat.id,
          lastMessage: {
            createdAt: chat.lastMessage.createdAt,
            hasMedias: !!chat.lastMessage.medias.length,
            id: chat.lastMessage.id,
            isRead: isLastMessageRead,
            text: chat.lastMessage.text,
          },
          withUser,
        });
      },
    );

    return chatsWithViewerData;
  }

  async getChatById(chatId: string): Promise<Chat | null> {
    const chatDocument = await this._chatModel.findById(chatId);
    if (!chatDocument) return null;

    return new Chat(chatDocument.toJSON());
  }

  async getChatWithViewerData(chatId: string, viewerId: string) {
    const aggregate = await this._chatModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(chatId),
        },
      },
      {
        $lookup: {
          as: 'userChat',
          foreignField: 'chatId',
          from: 'userChat',
          localField: '_id',
        },
      },
      { $match: {} },
      {
        $lookup: {
          as: 'lastMessage',
          foreignField: '_id',
          from: 'message',
          localField: 'lastMessageId',
        },
      },
    ]);
  }

  async deleteChat(chatId: string, userId: string): Promise<UserChat | null> {
    const _chat = await this._chatModel.findById(chatId);
    if (!_chat) return null;

    const _userChat = await this._userChatModel.findOneAndUpdate(
      { chatId, userId },
      { lastDeletedMessageId: _chat.lastMessageId },
      { new: true, upsert: true },
    );

    const userChat = new UserChat(_userChat.toJSON());
    return userChat;
  }

  async createMessage(create: CreateMessageDto, dbContext: MongoDBContext) {
    const [messageDocument] = await this._messageModel.insertMany([create], {
      session: dbContext.session,
    });

    await this._chatModel.updateOne(
      { _id: create.chatId },
      { lastMessageId: messageDocument._id, lastSenderId: create.userId },
      {
        session: dbContext.session,
      },
    );

    const message = new Message(messageDocument.toJSON());
    return message;
  }

  async getMessagesWithViewerData(filter: GetMessagesDto, viewerId: string) {}

  async getMessage(messageId: string): Promise<Message | null> {
    const _message = await this._messageModel.findById(messageId);
    if (!_message) return null;

    const message = new Message(_message.toJSON());
    return message;
  }

  async getMessageWithViewerData(messageId: string, viewerId: string) {}

  async updateMessage(messageId: string, update: UpdateMessageDto) {
    const _message = await this._messageModel.findOneAndUpdate(
      { _id: messageId },
      { $set: update },
      { new: true },
    );
    if (!_message) return null;

    const message = new Message(_message.toJSON());
    return message;
  }

  async deleteMessage(messageId: string): Promise<Message | null> {
    const _message = await this._messageModel.findOneAndDelete(
      {
        _id: messageId,
      },
      { new: true },
    );
    if (!_message) return null;

    const message = new Message(_message.toJSON());
    return message;
  }

  async getUserChatsData(userId: string): Promise<UserChatsData | null> {
    const aggregateResult = await this._chatModel.aggregate([
      {
        $match: {
          lastSenderId: {
            $ne: new mongoose.Types.ObjectId(userId),
          },
          participants: {
            $in: [new mongoose.Types.ObjectId(userId)],
          },
        },
      },
      {
        $lookup: {
          as: 'userChat',
          foreignField: 'chatId',
          from: 'userChat',
          localField: '_id',
          pipeline: [
            {
              $match: {
                lastReadMessageId: { $ne: '$lastMessageId' },
                userId: new mongoose.Types.ObjectId(userId),
              },
            },
          ],
        },
      },
      {
        $match: {
          userChat: { $exists: true },
        },
      },
      {
        $count: 'unreadChatsCount',
      },
    ]);

    return new UserChatsData({ unreadChats: [], unreadChatsCount: 1 });
  }

  async setMessageAsRead(
    messageId: string,
    userId: string,
  ): Promise<UserChat | null> {
    const _message = await this._messageModel.findById(messageId);
    if (!_message) return null;

    const _userChat = await this._userChatModel.findOneAndUpdate(
      {
        chatId: _message.chatId,
        userId,
      },
      {
        lastReadMessageId: messageId,
      },
      {
        new: true,
        upsert: true,
      },
    );

    const userChat = new UserChat(_userChat.toJSON());
    return userChat;
  }

  async setMessageAsPurchased(
    messageId: string,
    userId: string,
  ): Promise<UserMessage | null> {
    const _userMessage = await this._userMessageModel.findOneAndUpdate(
      { messageId, userId },
      { $set: { isPurchased: true } },
      {
        new: true,
        upsert: true,
      },
    );

    const userMessage = new UserMessage(_userMessage.toJSON());
    return userMessage;
  }
}
