import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { IUnitOfWorkFactory } from '@/common/domain/repositories/unit-of-work.factory';
import { CreateChatDto } from '@/modules/chats/domain/dtos/create-chat.dto';
import { CreateMessageDto } from '@/modules/chats/domain/dtos/create-message.dto';
import {
  CHATS_EVENTS,
  MessageCreatedEvent,
} from '@/modules/chats/domain/events';
import { Chat, Message } from '@/modules/chats/domain/models';
import { IChatsRepository } from '@/modules/chats/domain/repositories/chats.repository';
import { MediaService } from '@/modules/media/application/services/media.service';
import { UsersService } from '@/modules/users/application/services/users.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectPinoLogger(ChatsService.name) private readonly _logger: PinoLogger,
    private readonly _eventEmitter: EventEmitter2,
    @Inject(IChatsRepository)
    private readonly _chatsRepository: IChatsRepository,
    @Inject(IUnitOfWorkFactory)
    private readonly _unitOfWorkFactory: IUnitOfWorkFactory,
    private readonly _mediaService: MediaService,
    private readonly _usersService: UsersService,
  ) {}

  async createChat(create: CreateChatDto): Promise<Chat> {
    const uow = this._unitOfWorkFactory.create();

    try {
      await uow.start();

      const chat = await this._chatsRepository.createChat(create, uow);

      await uow.commit();

      return chat;
    } catch (error) {
      uow.rollback();

      throw error;
    } finally {
      uow.end();
    }
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
  async markMessageAsPurchased() {}

  async markMessageAsRead() {}

  async createMessage(create: CreateMessageDto): Promise<Message> {
    const uow = this._unitOfWorkFactory.create();
    await uow.start();

    try {
      const message = await this._chatsRepository.createMessage(create, uow);

      this._eventEmitter.emit(
        CHATS_EVENTS.messageCreated,
        new MessageCreatedEvent({
          messageId: message.id,
        }),
      );

      await uow.commit();

      return message;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.end();
    }
  }
}
