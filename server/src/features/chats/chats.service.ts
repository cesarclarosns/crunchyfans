import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose, { Model, PipelineStage } from 'mongoose';

import { MediaService } from '../media/media.service';
import { StorageService } from '../media/storage.service';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { ChatDto } from './dto/chat.dto';
import { ChatMessageDto } from './dto/chat-message.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateChatMassiveMessageDto } from './dto/create-chat-massive-message.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { CreateLastReadChatMessagePerUserDto } from './dto/create-last-read-chat-message-per-user.dto';
import { FindAllChatMessagesDto } from './dto/find-all-chat-messages.dto';
import { FindAllChatsDto } from './dto/find-all-chats.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { Chat, TChatFilterQuery } from './entities/chat.entity';
import {
  ChatMessage,
  TChatMessageFilterQuery,
} from './entities/chat-message.entity';
import { LastReadChatMessagePerUser } from './entities/last-read-chat-message-per-user.entity';
import { ChatMessageCreatedEvent, CHATS_EVENTS } from './events';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessage>,
    @InjectModel(LastReadChatMessagePerUser.name)
    private lastReadChatMessagePerUserModel: Model<LastReadChatMessagePerUser>,
    private readonly mediaService: MediaService,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createChatDto: CreateChatDto) {
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
  }: FindAllChatsDto) {
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
          as: 'message',
          foreignField: 'chatId',
          from: 'chatMessages',
          localField: '_id',
          pipeline: [
            {
              $set: {
                createdAt: {
                  $toDate: '$_id',
                },
              },
            },
            {
              $sort: { _id: order === 'recent' ? -1 : 1 },
            },
          ],
        },
      },
      {
        $set: {
          message: { $first: '$message' },
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
        $sort: { 'message._id': order === 'recent' ? -1 : 1 },
      },
      {
        $skip: +skip,
      },
      {
        $limit: +limit,
      },
      {
        $lookup: {
          as: 'message.isSeen',
          foreignField: 'chatId',
          from: 'lastReadChatMessagePerUser',
          localField: '_id',
          pipeline: [
            {
              $set: {
                messageCreatedAt: {
                  $toDate: '$messageId',
                },
              },
            },
            {
              $match: {
                userId: new mongoose.Types.ObjectId(userId),
              },
            },
            {
              $sort: {
                messageId: -1,
              },
            },
            {
              $limit: 1,
            },
          ],
        },
      },
      {
        $set: {
          'message.isSeen': {
            $cond: {
              else: false,
              if: {
                $gte: [
                  {
                    $getField: {
                      field: 'messageId',
                      input: {
                        $first: '$message.isSeen',
                      },
                    },
                  },
                  '$message._id',
                ],
              },
              then: true,
            },
          },
        },
      },
    ]);

    chats = JSON.parse(JSON.stringify(chats));

    for (const chat of chats) {
      for (const participant of chat.participants) {
        this.usersService.downloadPictures(participant);
      }
    }

    return chats;
  }

  async findOneById(chatId: string) {
    const chat: ChatDto = (
      await this.chatModel.findById(chatId).populate([
        {
          path: 'participants',
          populate: [
            { path: 'pictures.profilePicture' },
            { path: 'pictures.coverPicture' },
          ],
          select: '-password -oauth -settings -metadata',
        },
      ])
    )?.toJSON();

    if (chat) {
      for (const participant of chat.participants) {
        this.usersService.downloadPictures(
          participant as unknown as UserDto,
        );
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

  async createMessage(createChatMessageDto: CreateChatMessageDto) {
    const message = await this.chatMessageModel.create(createChatMessageDto);

    // Emit events
    this.eventEmitter.emit(
      CHATS_EVENTS.ChatMessageCreated,
      new ChatMessageCreatedEvent({
        chatId: createChatMessageDto.chatId,
        messageId: message._id.toString(),
      }),
    );

    return message;
  }

  async findAllMessages({
    skip,
    limit,
    cursor,
    chatId,
    order,
  }: FindAllChatMessagesDto) {
    let messages: ChatMessageDto[] = await this.chatMessageModel
      .find(
        {
          chatId,
          ...(cursor
            ? {
                _id: {
                  ...(order === 'recent'
                    ? {
                        $lt: cursor,
                      }
                    : {
                        $gt: cursor,
                      }),
                },
              }
            : {}),
        },
        {},
        {
          limit: +limit,
          skip: +skip,
          sort: {
            _id: order === 'recent' ? -1 : 1,
          },
        },
      )
      .populate([
        { path: 'user', select: '-password -oauth -settings -metadata' },
        { path: 'media' },
      ]);

    messages = JSON.parse(JSON.stringify(messages));

    for (const message of messages) {
      message.createdAt = new mongoose.Types.ObjectId(message._id)
        .getTimestamp()
        .toISOString();

      for (const media of message.media) {
        this.mediaService.downloadMedia(media);
      }
    }

    return messages;
  }

  async findOneMessage(filter: TChatMessageFilterQuery) {
    return await this.chatMessageModel
      .findOne(filter)
      .populate([
        { path: 'user', select: '-password -oauth -settings -metadata' },
      ]);
  }

  async findOneMessageById(messageId: string) {
    const message: ChatMessageDto = (
      await this.chatMessageModel
        .findById(messageId)
        .populate([
          { path: 'user', select: '-password -oauth -settings -metadata' },
        ])
    ).toJSON();

    if (message) {
      message.createdAt = new mongoose.Types.ObjectId(message._id)
        .getTimestamp()
        .toISOString();
    }

    return message;
  }

  async updateMessage(
    filter: TChatMessageFilterQuery,
    updateChatMessageDto: UpdateChatMessageDto,
  ) {
    return await this.chatMessageModel.updateOne(
      { _id: filter.messageId, userId: filter.messageId },
      updateChatMessageDto,
    );
  }

  async deleteMessage(filter: TChatMessageFilterQuery) {
    return await this.chatMessageModel.deleteOne(filter);
  }

  async createMassiveMessage(
    createChatMassiveMessageDto: CreateChatMassiveMessageDto,
  ) {
    console.log({ createChatMassiveMessageDto });
  }

  async createLastReadMessagePerUser(
    createLastReadMessagePerUserDto: CreateLastReadChatMessagePerUserDto,
  ) {
    return await this.lastReadChatMessagePerUserModel.findOneAndUpdate(
      createLastReadMessagePerUserDto,
      {},
      { new: true, upsert: true },
    );
  }
}
