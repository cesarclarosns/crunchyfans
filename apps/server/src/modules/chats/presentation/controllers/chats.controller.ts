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
 * post /chats create chat
 * get /chats get chats
 * get /chats/:chatId get chat
 * delete /chats/:chatId delete chat
 *
 * post /chats/:chatId/messages create message
 * post /chats/:chatId/messages/:messageId/read read message
 * get /chats/:chatId/messages
 *
 * post /chats/massive-message
 *
 */

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly chatsRepository: ChatsRepository,
  ) {}

  @Post()
  async createChat(@Body() body: CreateChatDto) {
    return await this.chatsService.createChat(body);
  }

  @Get()
  async getChats(@Req() req: Request, @Query() query: GetChatsDto) {
    const userId = req.user.sub;

    return await this.chatsRepository.getChatsWithViewerData(query, userId);
  }

  @Get(':chatId')
  async getChatById(@Req() req: Request, @Param('chatId') chatId: string) {
    return await this.chatsRepository.getChatById(chatId);
  }

  @Patch(':chatId')
  async updateChat(
    @Param('chatId') chatId: string,
    @Body() body: UpdateChatDto,
  ) {
    return await this.chatsService.updateChat(chatId, body);
  }

  @Delete(':chatId')
  async removeChat(@Param('chatId') chatId: string) {
    return await this.chatsService.removeChat(chatId);
  }

  @Post(':chatId/messages')
  async createMessage(
    @Req() req: Request,
    @Param('chatId') chatId: string,
    @Body() body: CreateMessageDto,
  ) {
    const userId = req.user.sub;

    body.userId = userId;
    body.chatId = chatId;

    return await this.chatsService.createMessage(body);
  }

  @Get(':chatId/messages')
  async getMessages(
    @Param('chatId') chatId: string,
    @Query() query: FindAllMessagesDto,
  ) {
    query.chatId = chatId;

    return await this.chatsService.findAllMessages(query);
  }

  @Get(':chatId/messages/:messageId')
  async getMessageById(@Param('messageId') messageId: string) {
    return await this.chatsService.findOneMessageById(messageId);
  }

  @Patch(':chatId/messages/:messageId')
  async updateMessage(
    @Req() req: Request,
    @Param('messageId') messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return await this.chatsService.updateMessage(messageId, updateMessageDto);
  }

  @Delete(':chatId/messages/:messageId')
  async deleteMessage(
    @Req() req: Request,
    @Param('messageId') messageId: string,
  ) {
    return await this.chatsService.deleteMessage(messageId);
  }

  @Post(':chatId/messages/:messageId/read')
  async readMessage(
    @Req() req: Request,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
  ) {
    const userId = req.user.sub;

    return await this.chatsService.readMessage({ chatId, messageId, userId });
  }

  @Post('massive-message')
  async createMassiveMessage(
    @Req() req: Request,
    @Body() createMassiveMessageDto: CreateMassiveMessageDto,
  ) {
    const userId = req.user.sub;

    createMassiveMessageDto.userId = userId;

    return await this.chatsService.createMassiveMessage(
      createMassiveMessageDto,
    );
  }
}
