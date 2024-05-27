import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

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
import { StorageService } from '@/modules/media/application/services/storage.service';

export class ChatsRepository {
  constructor(
    @InjectPinoLogger(ChatsRepository.name) private readonly logger: PinoLogger,
    private readonly storageService: StorageService,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(ChatEntity.name) private readonly chatModel: Model<ChatEntity>,
    @InjectModel(MessageEntity.name)
    private readonly messageModel: Model<MessageEntity>,
    @InjectModel(UserChatEntity.name)
    private readonly userChatModel: Model<UserChatEntity>,
    @InjectModel(UserMessageEntity.name)
    private readonly userMessageModel: Model<UserMessageEntity>,
  ) {}

  async createChat(create: CreateChatDto): Promise<Chat> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const chatDocument = await this.chatModel.create(create);

      const userChatsDocuments = await this.userChatModel.insertMany(
        create.participants.map((userId) => ({
          chatId: chatDocument.id,
          userId,
        })),
      );

      await session.commitTransaction();

      this.logger.debug('createChat', {
        chatDocument,
        userChatsDocuments,
      });

      return new Chat(chatDocument.toJSON());
    } catch (error) {
      this.logger.error(error);

      await session.abortTransaction();
      throw error;
    }
  }

  async getChatsWithViewerData(
    filter: GetChatsDto,
    viewerId: string,
  ): Promise<ChatWithViewerData[]> {
    const aggregateResults = await this.chatModel.aggregate([
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

    const chatsWithViewerData: ChatWithViewerData[] = aggregateResults.map(
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
    const chatDocument = await this.chatModel.findById(chatId);
    if (!chatDocument) return null;

    return new Chat(chatDocument.toJSON());
  }

  async getChatWithViewerData(chatId: string, viewerId: string) {
    const aggregateResults = await this.chatModel.aggregate([
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
    const chatDocument = await this.chatModel.findById(chatId);
    if (!chatDocument) return null;

    const userChatDocument = await this.userChatModel.findOneAndUpdate(
      { chatId, userId },
      { lastDeletedMessageId: chatDocument!.lastMessageId },
      { new: true, upsert: true },
    );

    return new UserChat(userChatDocument.toJSON());
  }

  async createMessage(create: CreateMessageDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const [messageDocument] = await this.messageModel.insertMany([create], {
        session,
      });

      await this.chatModel.updateOne(
        { _id: create.chatId },
        { lastMessageId: messageDocument._id, lastSenderId: create.userId },
        {
          session,
        },
      );

      await session.commitTransaction();

      return new Message(messageDocument.toJSON());
    } catch (error) {
      this.logger.error('createMessage', error);

      await session.abortTransaction();
      throw error;
    }
  }

  async getMessagesWithViewerData(filter: GetMessagesDto, viewerId: string) {}

  async getMessage(messageId: string): Promise<Message | null> {
    const messageDocument = await this.messageModel.findById(messageId);
    if (!messageDocument) return null;

    return new Message(messageDocument.toJSON());
  }

  async getMessageWithViewerData(messageId: string, viewerId: string) {}

  async updateMessage(messageId: string, update: UpdateMessageDto) {
    const messageDocument = await this.messageModel.findOneAndUpdate(
      { _id: messageId },
      { $set: update },
      { new: true },
    );
    if (!messageDocument) return null;

    return new Message(messageDocument.toJSON());
  }

  async deleteMessage(messageId: string): Promise<Message | null> {
    const messageDocument = await this.messageModel.findOneAndDelete(
      {
        _id: messageId,
      },
      { new: true },
    );
    if (!messageDocument) return null;

    return new Message(messageDocument.toJSON());
  }

  async markMessageAsRead(
    messageId: string,
    userId: string,
  ): Promise<UserChat | null> {
    const messageDocument = await this.messageModel.findById(messageId);
    if (!messageDocument) return null;

    const userChatDocument = await this.userChatModel.findOneAndUpdate(
      {
        chatId: messageDocument.chatId,
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

    return new UserChat(userChatDocument.toJSON());
  }

  async markMessageAsPurchased(
    messageId: string,
    userId: string,
  ): Promise<UserMessage> {
    const userMessageDocument = await this.userMessageModel.findOneAndUpdate(
      { messageId, userId },
      { $set: { isPurchased: true } },
      {
        new: true,
        upsert: true,
      },
    );

    return new UserMessage(userMessageDocument.toJSON());
  }

  async getUserChatsData(userId: string): Promise<UserChatsData | null> {
    const aggregateResult = await this.chatModel.aggregate([
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
}
