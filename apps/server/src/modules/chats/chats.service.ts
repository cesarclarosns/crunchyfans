import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MediaService } from '../media/application/services/media.service';
import { UserDto } from '../users/application/dtos/user.dto';
import { UsersService } from '../users/application/services/users.service';
import { ChatDto } from './application/dtos/chat.dto';
import { CreateChatDto } from './application/dtos/create-chat.dto';
import { CreateMassiveMessageDto } from './application/dtos/create-massive-message.dto';
import { CreateMessageDto } from './application/dtos/create-message.dto';
import { FindAllChatsDto } from './application/dtos/find-all-chats.dto';
import { FindAllMessagesDto } from './application/dtos/find-all-messages.dto';
import { MessageDto } from './application/dtos/message.dto';
import { UpdateChatDto } from './application/dtos/update-chat.dto';
import { UpdateMessageDto } from './application/dtos/update-message.dto';
import { Chat } from './infrastructure/schemas/chat.schema';
import { LastReadMessagePerUser } from './infrastructure/schemas/last-read-message-per-user.schema';
import { Message } from './infrastructure/schemas/message.schema';
import { UserMessageAccess } from './infrastructure/schemas/user-messages-access.schema';
import { CHATS_EVENTS, MessageCreatedEvent } from './application/events';
import { MessageReadEvent } from './application/events/message-read.event';

@Injectable()
export class ChatsService {
  constructor(
    @InjectPinoLogger(ChatsService.name) private readonly logger: PinoLogger,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(LastReadMessagePerUser.name)
    private readonly lastReadMessagePerUserModel: Model<LastReadMessagePerUser>,
    @InjectModel(UserMessageAccess.name)
    private readonly userMessageAccess: Model<UserMessageAccess>,
    private readonly eventEmitter: EventEmitter2,
    private readonly mediaService: MediaService,
  ) {}

  async createChat(createChatDto: CreateChatDto): Promise<ChatDto> {
    return await this.chatModel.findOneAndUpdate(
      {
        participants: {
          $all: createChatDto.participants.map((id) => ({
            $elemMatch: {
              $eq: new mongoose.Types.ObjectId(id),
            },
          })),
        },
      },
      {
        $setOnInsert: {
          participants: createChatDto.participants.map(
            (id) => new mongoose.Types.ObjectId(id),
          ),
        },
      },
      { new: true, upsert: true },
    );
  }

  async findAllChats(
    { cursor, skip, limit, order, query }: FindAllChatsDto,
    toUserId?: string,
  ): Promise<ChatDto[]> {
    const documents = await this.chatModel.aggregate([
      {
        $match: {
          participants: {
            $in: [new mongoose.Types.ObjectId(toUserId)],
          },
        },
      },
      {
        $lookup: {
          as: 'participants',
          foreignField: '_id',
          from: 'user',
          localField: 'participants',
        },
      },
      {
        $lookup: {
          as: 'lastMessage',
          foreignField: 'chatId',
          from: 'message',
          localField: '_id',
          pipeline: [
            {
              $sort: { _id: -1 },
            },
            {
              $limit: 1,
            },
            {
              $lookup: {
                as: 'seenBy',
                foreignField: 'messageId',
                from: 'lastReadMessagePerUser',
                localField: '_id',
              },
            },
            {
              $set: {
                createdAt: {
                  $toDate: '$_id',
                },
                isSeen: {
                  $cond: {
                    else: false,
                    if: {
                      $and: [],
                    },
                    then: true,
                  },
                },
              },
            },
            {
              $project: {
                seenBy: 0,
              },
            },
          ],
        },
      },
      {
        $set: {
          lastMessage: { $first: '$lastMessage' },
        },
      },
      {
        $match: {
          ...(cursor
            ? {
                'message._id': {
                  ...(order === 'recent'
                    ? {
                        $lt: new mongoose.Types.ObjectId(cursor),
                      }
                    : {
                        $gt: new mongoose.Types.ObjectId(cursor),
                      }),
                },
              }
            : {}),
          ...(query
            ? {
                participants: {
                  $elemMatch: {
                    _id: {
                      $ne: new mongoose.Types.ObjectId(toUserId),
                    },
                    displayName: {
                      $options: 'i',
                      $regex: new RegExp(query),
                    },
                  },
                },
              }
            : {}),
        },
      },
      {
        $sort: { 'lastMessage._id': order === 'recent' ? -1 : 1 },
      },
      {
        $skip: +skip,
      },
      {
        $limit: +limit,
      },
    ]);

    const chats = [];

    return chats;
  }

  async findOneChatById(chatId: string): Promise<ChatDto | null> {
    const document = await this.chatModel.findById(chatId);

    if (!document) return null;

    return null;
  }

  async updateChat(chatId: string, updateChatDto: UpdateChatDto) {
    return await this.chatModel.updateOne({ _id: chatId }, updateChatDto);
  }

  async removeChat(chatId: string) {
    return await this.chatModel.deleteOne({ _id: chatId });
  }

  // async getChatsDataByUserId(userId: string): Promise<{ count: number }> {
  //   const results = await this.chatModel.aggregate([
  //     {
  //       $match: {
  //         participants: {
  //           $in: [new mongoose.Types.ObjectId(userId)],
  //         },
  //       },
  //     },
  //     {
  //       $lookup: {
  //         as: 'lastMessage',
  //         foreignField: 'chatId',
  //         from: 'message',
  //         localField: '_id',
  //         pipeline: [
  //           {
  //             $sort: { _id: -1 },
  //           },
  //           {
  //             $limit: 1,
  //           },
  //           {
  //             $lookup: {
  //               as: 'seenBy',
  //               foreignField: 'messageId',
  //               from: 'lastReadMessagePerUser',
  //               localField: '_id',
  //             },
  //           },
  //           {
  //             $set: {
  //               seenBy: '$seenBy.userId',
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $set: {
  //         message: { $first: '$lastMessage' },
  //       },
  //     },
  //     {
  //       $match: {
  //         $and: [
  //           {
  //             'lastMessage.userId': {
  //               $ne: new mongoose.Types.ObjectId(userId),
  //             },
  //           },
  //           {
  //             'lastMessage.seenBy': {
  //               $nin: [new mongoose.Types.ObjectId(userId)],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $count: 'count',
  //     },
  //   ]);

  //   return results.at(0);
  // }

  async createMessage(createMessageDto: CreateMessageDto): Promise<MessageDto> {
    const document = await this.messageModel.create(createMessageDto);
    const message = document.toJSON() as MessageDto;

    // Emit events
    this.eventEmitter.emit(
      CHATS_EVENTS.MessageCreated,
      new MessageCreatedEvent({
        chatId: message.chatId,
        messageId: message.id,
      }),
    );

    return message;
  }

  async findAllMessages(
    { skip, limit, cursor, chatId }: FindAllMessagesDto,
    toUserId?: string,
  ): Promise<MessageDto[]> {
    let aggregate = await this.messageModel.aggregate([
      {
        $match: {
          chatId: new mongoose.Types.ObjectId(chatId),
          ...(!!cursor
            ? {
                cursor: {
                  $lt: new mongoose.Types.ObjectId(cursor),
                },
              }
            : {}),
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $skip: +skip,
      },
      {
        $limit: +limit,
      },
      {
        $lookup: {
          as: 'seenBy',
          foreignField: 'messageId',
          from: 'lastReadMessagePerUser',
          localField: '_id',
        },
      },
      {
        $set: {
          createdAt: {
            $toDate: '$_id',
          },
          seenBy: '$seenBy.userId',
        },
      },
    ]);

    aggregate = await this.messageModel.populate(aggregate, [
      {
        path: 'user',
        select: '-password -oauth -settings',
      },
      {
        path: 'media',
      },
    ]);

    return [];
  }

  async findOneMessageById(messageId: string): Promise<MessageDto | null> {
    let aggregate = await this.messageModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(messageId),
        },
      },
      {
        $lookup: {
          as: 'seenBy',
          foreignField: 'messageId',
          from: 'lastReadMessagePerUser',
          localField: '_id',
        },
      },
      {
        $set: {
          createdAt: {
            $toDate: '$_id',
          },
          seenBy: '$seenBy.userId',
        },
      },
    ]);

    aggregate = await this.messageModel.populate(aggregate, [
      {
        path: 'user',
        select: '-password -oauth -settings',
      },
      {
        path: 'media',
      },
    ]);

    const messages = JSON.parse(JSON.stringify(aggregate));

    return null;
  }

  async updateMessage(messageId: string, updateMessageDto: UpdateMessageDto) {
    return await this.messageModel.updateOne(
      { _id: messageId },
      { $set: updateMessageDto },
    );
  }

  async deleteMessage(messageId: string) {
    return await this.messageModel.deleteOne({
      _id: messageId,
    });
  }

  async readMessage({
    messageId,
    userId,
    chatId,
  }: {
    userId: string;
    messageId: string;
    chatId: string;
  }) {
    await this.lastReadMessagePerUserModel.updateOne(
      {
        chatId,
        messageId,
        userId,
      },
      {},
      { upsert: true },
    );

    this.eventEmitter.emit(
      CHATS_EVENTS.MessageRead,
      new MessageReadEvent({ chatId, messageId, userId }),
    );
  }

  async createMassiveMessage(
    createMassiveMessageDto: CreateMassiveMessageDto,
  ) {}
}
