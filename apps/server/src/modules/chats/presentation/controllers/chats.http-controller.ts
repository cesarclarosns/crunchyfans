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

import { CreateChatDto } from '../../application/dtos/create-chat.dto';
import { CreateMassiveMessageDto } from '../../application/dtos/create-massive-message.dto';
import { CreateMessageDto } from '../../application/dtos/create-message.dto';
import { FindAllChatsDto } from '../../application/dtos/find-all-chats.dto';
import { FindAllMessagesDto } from '../../application/dtos/find-all-messages.dto';
import { UpdateChatDto } from '../../application/dtos/update-chat.dto';
import { UpdateMessageDto } from '../../application/dtos/update-message.dto';
import { ChatsService } from '../../chats.service';

@Controller('chats')
export class ChatsHttpController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  async createChat(@Body() body: CreateChatDto) {
    return await this.chatsService.createChat(body);
  }

  @Get()
  async findAllChats(@Req() req: Request, @Query() query: FindAllChatsDto) {
    const userId = req.user.sub;

    query.toUserId = userId;

    return await this.chatsService.findAllChats(query);
  }

  @Get(':chatId')
  async findOneChat(@Req() req: Request, @Param('chatId') chatId: string) {
    return await this.chatsService.findOneChatById(chatId);
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
  async findAllMessages(
    @Param('chatId') chatId: string,
    @Query() query: FindAllMessagesDto,
  ) {
    query.chatId = chatId;

    return await this.chatsService.findAllMessages(query);
  }

  @Get(':chatId/messages/:messageId')
  async findOneMessage(@Param('messageId') messageId: string) {
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
