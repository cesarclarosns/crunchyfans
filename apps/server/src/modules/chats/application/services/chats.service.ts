import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MediaService } from '../../../media/application/services/media.service';
import { UsersService } from '../../../users/application/services/users.service';
import { ChatDto } from '../../domain/dtos/chat.dto';
import { CreateChatDto } from '../../domain/dtos/create-chat.dto';
import { CreateMassiveMessageDto } from '../../domain/dtos/create-massive-message.dto';
import { CreateMessageDto } from '../../domain/dtos/create-message.dto';
import { MessageDto } from '../../domain/dtos/message.dto';
import { UpdateChatDto } from '../../domain/dtos/update-chat.dto';
import { UpdateMessageDto } from '../../domain/dtos/update-message.dto';
import { Chat, Message } from '../../domain/models';
import { ChatsRepository } from '../../infrastructure/repositories/chats.repository';
import { CHATS_EVENTS, MessageCreatedEvent } from '../events';
import { MessageReadEvent } from '../events/message-read.event';

@Injectable()
export class ChatsService {
  constructor(
    @InjectPinoLogger(ChatsService.name) private readonly logger: PinoLogger,
    private readonly eventEmitter: EventEmitter2,
    private readonly chatsRepository: ChatsRepository,
  ) {}

  async createChat(create: CreateChatDto): Promise<Chat> {
    return await this.chatsRepository.createChat(create);
  }

  // async findAllChats(
  //   { cursor, skip, limit, order, query }: FindAllChatsDto,
  //   toUserId?: string,
  // ): Promise<ChatDto[]> {
  //   const documents = await this.chatModel.aggregate([
  //     {
  //       $match: {
  //         participants: {
  //           $in: [new mongoose.Types.ObjectId(toUserId)],
  //         },
  //       },
  //     },
  //     {
  //       $lookup: {
  //         as: 'participants',
  //         foreignField: '_id',
  //         from: 'user',
  //         localField: 'participants',
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
  //               createdAt: {
  //                 $toDate: '$_id',
  //               },
  //               isSeen: {
  //                 $cond: {
  //                   else: false,
  //                   if: {
  //                     $and: [],
  //                   },
  //                   then: true,
  //                 },
  //               },
  //             },
  //           },
  //           {
  //             $project: {
  //               seenBy: 0,
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $set: {
  //         lastMessage: { $first: '$lastMessage' },
  //       },
  //     },
  //     {
  //       $match: {
  //         ...(cursor
  //           ? {
  //               'message._id': {
  //                 ...(order === 'recent'
  //                   ? {
  //                       $lt: new mongoose.Types.ObjectId(cursor),
  //                     }
  //                   : {
  //                       $gt: new mongoose.Types.ObjectId(cursor),
  //                     }),
  //               },
  //             }
  //           : {}),
  //         ...(query
  //           ? {
  //               participants: {
  //                 $elemMatch: {
  //                   _id: {
  //                     $ne: new mongoose.Types.ObjectId(toUserId),
  //                   },
  //                   displayName: {
  //                     $options: 'i',
  //                     $regex: new RegExp(query),
  //                   },
  //                 },
  //               },
  //             }
  //           : {}),
  //       },
  //     },
  //     {
  //       $sort: { 'lastMessage._id': order === 'recent' ? -1 : 1 },
  //     },
  //     {
  //       $skip: +skip,
  //     },
  //     {
  //       $limit: +limit,
  //     },
  //   ]);

  //   const chats = [];

  //   return chats;
  // }

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

  async createMessage(create: CreateMessageDto): Promise<Message> {
    const message = await this.chatsRepository.createMessage(create);

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
}
