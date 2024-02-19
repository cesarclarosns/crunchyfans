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
import aqp from 'api-query-params';
import { Request } from 'express';
import mongoose from 'mongoose';

import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateChatMassiveMessageDto } from './dto/create-chat-massive-message.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { FindAllChatMessagesDto } from './dto/find-all-chat-messages.dto';
import { FindAllChatsDto } from './dto/find-all-chats.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  async create(@Body() createChatDto: CreateChatDto) {
    console.log('create', { createChatDto });
    return await this.chatsService.create(createChatDto);
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query() findAllChatsDto: FindAllChatsDto,
  ) {
    const userId = req.user.sub;

    findAllChatsDto.userId = userId;

    return await this.chatsService.findAll(findAllChatsDto);
  }

  @Get(':chatId')
  async findOne(@Param('chatId') chatId: string) {
    return await this.chatsService.findOneById(chatId);
  }

  @Patch(':chatId')
  async update(
    @Param('chatId') chatId: string,
    @Body() updateChatDto: UpdateChatDto,
  ) {
    return await this.chatsService.update(chatId, updateChatDto);
  }

  @Delete(':chatId')
  async remove(@Param('chatId') chatId: string) {
    return await this.chatsService.remove(chatId);
  }

  @Post(':chatId/messages')
  async createMessage(
    @Req() req: Request,
    @Param('chatId') chatId: string,
    @Body() createChatMessageDto: CreateChatMessageDto,
  ) {
    const userId = req.user.sub;

    createChatMessageDto.userId = userId;
    createChatMessageDto.chatId = chatId;

    return await this.chatsService.createMessage(createChatMessageDto);
  }

  @Get(':chatId/messages')
  async findAllMessages(
    @Param('chatId') chatId: string,
    @Query() findAllChatMessagesDto: FindAllChatMessagesDto,
  ) {
    findAllChatMessagesDto.chatId = chatId;

    return await this.chatsService.findAllMessages(findAllChatMessagesDto);
  }

  @Get(':chatId/messages/:messageId')
  async findOneMessage(@Param('messageId') messageId: string) {
    return await this.chatsService.findOneMessageById(messageId);
  }

  @Patch(':chatId/messages/:messageId')
  async updateMessage(
    @Req() req: Request,
    @Param('messageId') messageId: string,
    @Body() updateChatMessageDto: UpdateChatMessageDto,
  ) {
    const userId = req.user.sub;

    return await this.chatsService.updateMessage(
      { _id: messageId, userId },
      updateChatMessageDto,
    );
  }

  @Delete(':chatId/messages/:messageId')
  async deleteMessage(
    @Req() req: Request,
    @Param('messageId') messageId: string,
  ) {
    const userId = req.user.sub;

    return await this.chatsService.deleteMessage({ _id: messageId, userId });
  }

  @Post(':chatId/massive-message')
  async createMassiveMessage(
    @Req() req: Request,
    @Body() createMassiveMessageDto: CreateChatMassiveMessageDto,
  ) {
    const userId = req.user.sub;

    createMassiveMessageDto.userId = userId;

    return await this.chatsService.createMassiveMessage(
      createMassiveMessageDto,
    );
  }
}
