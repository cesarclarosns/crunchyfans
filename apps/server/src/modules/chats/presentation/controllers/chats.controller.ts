import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { ChatsService } from '../../application/services/chats.service';
import { CreateChatDto } from '../../domain/dtos/create-chat.dto';
import { CreateMassiveMessageDto } from '../../domain/dtos/create-massive-message.dto';
import { CreateMessageDto } from '../../domain/dtos/create-message.dto';
import { GetChatsDto } from '../../domain/dtos/get-chats.dto';
import { GetMessagesDto } from '../../domain/dtos/get-messages.dto';
import { UpdateChatDto } from '../../domain/dtos/update-chat.dto';
import { UpdateMessageDto } from '../../domain/dtos/update-message.dto';
import { ChatsRepository } from '../../infrastructure/repositories/chats.repository';

/**
 * POST /chats
 * GET /chats
 * GET /chats/:chatId
 * DELETE /chats/:chatId
 *
 * POST /chats/:chatId/messages
 * POST /chats/:chatId/messages/:messageId/read
 * GET /chats/:chatId/messages
 *
 * GET /chats/unread-chats
 * POST /chats/massive-message
 *
 */

@Controller('chats')
export class ChatsController {
  constructor(
    @InjectPinoLogger(ChatsController.name)
    private readonly _logger: PinoLogger,
    private readonly _chatsService: ChatsService,
    private readonly _chatsRepository: ChatsRepository,
  ) {}

  @Post()
  async createChat(@Body() body: CreateChatDto) {
    return await this._chatsService.createChat(body);
  }

  @Get()
  async getChats(@Req() req: Request, @Query() query: GetChatsDto) {
    const userId = req.user.sub;

    return await this._chatsRepository.getChatsWithViewerData(query, userId);
  }

  @Get(':chatId')
  async getChatById(@Req() req: Request, @Param('chatId') chatId: string) {
    return await this._chatsRepository.getChatById(chatId);
  }

  @Patch(':chatId')
  async updateChat(
    @Param('chatId') chatId: string,
    @Body() body: UpdateChatDto,
  ) {}

  @Delete(':chatId')
  async removeChat(@Param('chatId') chatId: string) {}

  @Post(':chatId/messages')
  async createMessage(
    @Req() req: Request,
    @Param('chatId') chatId: string,
    @Body() body: CreateMessageDto,
  ) {
    const userId = req.user.sub;

    body.userId = userId;
    body.chatId = chatId;

    return await this._chatsService.createMessage(body);
  }

  @Get(':chatId/messages')
  async getMessages(
    @Param('chatId') chatId: string,
    @Query() query: GetMessagesDto,
  ) {
    query.chatId = chatId;
  }

  @Get(':chatId/messages/:messageId')
  async getMessageById(@Param('messageId') messageId: string) {}

  @Patch(':chatId/messages/:messageId')
  async updateMessage(
    @Req() req: Request,
    @Param('messageId') messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {}

  @Delete(':chatId/messages/:messageId')
  async deleteMessage(
    @Req() req: Request,
    @Param('messageId') messageId: string,
  ) {}

  @Post(':chatId/messages/:messageId/read')
  async readMessage(
    @Req() req: Request,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
  ) {
    const userId = req.user.sub;
  }

  @Post('massive-message')
  async createMassiveMessage(
    @Req() req: Request,
    @Body() createMassiveMessageDto: CreateMassiveMessageDto,
  ) {
    const userId = req.user.sub;

    createMassiveMessageDto.userId = userId;
  }
}
