import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { MediaService } from '../media/media.service';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { ChatDto } from './dto/chat.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMassiveMessageDto } from './dto/create-massive-message.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { FindAllChatsDto } from './dto/find-all-chats.dto';
import { FindAllMessagesDto } from './dto/find-all-messages.dto';
import { MessageDto } from './dto/message.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Chat } from './entities/chat.entity';
import { LastReadMessagePerUser } from './entities/last-read-message-per-user.entity';
import { Message, MessageFilterQuery } from './entities/message.entity';
import { CHATS_EVENTS, MessageCreatedEvent } from './events';
import { MessageReadEvent } from './events/message-read.event';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(LastReadMessagePerUser.name)
    private lastReadMessagePerUserModel: Model<LastReadMessagePerUser>,
    private readonly eventEmitter: EventEmitter2,
    private readonly mediaService: MediaService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async create(createChatDto: CreateChatDto): Promise<ChatDto> {
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

  async findAll({
    cursor,
    userId,
    skip,
    limit,
    order,
    query,
  }: FindAllChatsDto): Promise<ChatDto[]> {
    let chats: ChatDto[] = await this.chatModel.aggregate([
      {
        $match: {
          participants: {
            $in: [new mongoose.Types.ObjectId(userId)],
          },
        },
      },
      {
        $lookup: {
          as: 'participants',
          foreignField: '_id',
          from: 'users',
          localField: 'participants',
          pipeline: [
            {
              $lookup: {
                as: 'pictures.profilePicture',
                foreignField: '_id',
                from: 'media',
                localField: 'pictures.profilePicture',
              },
            },
            {
              $set: {
                'pictures.profilePicture': {
                  $first: '$pictures.profilePicture',
                },
              },
            },
            {
              $project: {
                metadata: 0,
                oauth: 0,
                password: 0,
                settings: 0,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          as: 'lastMessage',
          foreignField: 'chatId',
          from: 'messages',
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
                seenBy: '$seenBy.userId',
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
                      $ne: new mongoose.Types.ObjectId(userId),
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

    chats = JSON.parse(JSON.stringify(chats));

    for (const chat of chats) {
      for (const participant of chat.participants) {
        this.usersService.downloadPictures(participant.pictures);
      }
    }

    return chats;
  }

  async findOneById(chatId: string): Promise<ChatDto | null> {
    const _chat = await this.chatModel.findById(chatId).populate([
      {
        path: 'participants',
        populate: [{ path: 'pictures.profilePicture' }],
        select: '_id email username displayName bio lastConnection pictures',
      },
    ]);

    const chat = JSON.parse(JSON.stringify(_chat));

    if (chat) {
      for (const participant of chat.participants) {
        this.usersService.downloadPictures(participant.pictures);
      }
    }

    return chat;
  }

  async update(chatId: string, updateChatDto: UpdateChatDto) {
    return await this.chatModel.updateOne({ _id: chatId }, updateChatDto);
  }

  async remove(chatId: string) {
    return await this.chatModel.deleteOne({ _id: chatId });
  }

  async getUnreadChats(userId: string): Promise<{ count: number }> {
    const results = await this.chatModel.aggregate([
      {
        $match: {
          participants: {
            $in: [new mongoose.Types.ObjectId(userId)],
          },
        },
      },
      {
        $lookup: {
          as: 'lastMessage',
          foreignField: 'chatId',
          from: 'messages',
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
                seenBy: '$seenBy.userId',
              },
            },
          ],
        },
      },
      {
        $set: {
          message: { $first: '$lastMessage' },
        },
      },
      {
        $match: {
          $and: [
            {
              'lastMessage.userId': {
                $ne: new mongoose.Types.ObjectId(userId),
              },
            },
            {
              'lastMessage.seenBy': {
                $nin: [new mongoose.Types.ObjectId(userId)],
              },
            },
          ],
        },
      },
      {
        $count: 'count',
      },
    ]);

    return results.at(0);
  }

  async createMessage(createMessageDto: CreateMessageDto): Promise<MessageDto> {
    const messageCreated = await this.messageModel.create(createMessageDto);

    // Emit events
    this.eventEmitter.emit(
      CHATS_EVENTS.MessageCreated,
      new MessageCreatedEvent({
        chatId: createMessageDto.chatId,
        messageId: messageCreated._id.toString(),
      }),
    );

    return messageCreated.toJSON();
  }

  async findAllMessages({
    skip,
    limit,
    cursor,
    chatId,
  }: FindAllMessagesDto): Promise<MessageDto[]> {
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

    const messages = JSON.parse(JSON.stringify(aggregate));

    for (const message of messages) {
      for (const media of message.media) {
        this.mediaService.downloadMedia(media);
      }
    }

    return messages;
  }

  async findOneMessageById(messageId: string): Promise<MessageDto> {
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

    for (const message of messages) {
      for (const media of message.media) {
        this.mediaService.downloadMedia(media);
      }
    }

    return messages.at(0);
  }

  async updateMessage(
    filter: MessageFilterQuery,
    updateMessageDto: UpdateMessageDto,
  ) {
    return await this.messageModel.updateOne(
      { _id: filter.messageId, userId: filter.messageId },
      updateMessageDto,
    );
  }

  async deleteMessage(filter: MessageFilterQuery) {
    return await this.messageModel.deleteOne(filter);
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

  async createMassiveMessage(createMassiveMessageDto: CreateMassiveMessageDto) {
    console.log({ createMassiveMessageDto });
  }
}
