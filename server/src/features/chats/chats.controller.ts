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

import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMassiveMessageDto } from './dto/create-massive-message.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { FindAllChatsDto } from './dto/find-all-chats.dto';
import { FindAllMessagesDto } from './dto/find-all-messages.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  async create(@Body() createChatDto: CreateChatDto) {
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

  @Get('unread')
  async getUnreadChats(@Req() req: Request) {
    const userId = req.user.sub;

    return await this.chatsService.getUnreadChats(userId);
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
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const userId = req.user.sub;

    createMessageDto.userId = userId;
    createMessageDto.chatId = chatId;

    return await this.chatsService.createMessage(createMessageDto);
  }

  @Get(':chatId/messages')
  async findAllMessages(
    @Param('chatId') chatId: string,
    @Query() findAllMessagesDto: FindAllMessagesDto,
  ) {
    findAllMessagesDto.chatId = chatId;

    return await this.chatsService.findAllMessages(findAllMessagesDto);
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
    const userId = req.user.sub;

    return await this.chatsService.updateMessage(
      { _id: messageId, userId },
      updateMessageDto,
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

  @Post(':chatId/messages/:messageId/read')
  async readMessage(
    @Req() req: Request,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
  ) {
    const userId = req.user.sub;

    return await this.chatsService.readMessage({ chatId, messageId, userId });
  }

  @Post(':chatId/massive-message')
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
