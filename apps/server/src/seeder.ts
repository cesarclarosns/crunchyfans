import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { seeder } from 'nestjs-seeder';

import { databaseSettings } from '@/config';
import { MongoChatsSeeder } from '@/modules/chats/infrastructure/seeders';
import { MongoPostsSeeder } from '@/modules/posts/infrastructure/seeders';
import { MongoUsersSeeder } from '@/modules/users/infrastructure/seeders';

import {
  MongoChat,
  MongoChatSchema,
  MongoMessage,
  MongoMessageSchema,
  MongoUserChat,
  MongoUserChatSchema,
  MongoUserMessage,
  MongoUserMessageSchema,
} from './modules/chats/infrastructure/entities';
import {
  MongoPost,
  MongoPostComment,
  MongoPostCommentSchema,
  MongoPostSchema,
  MongoUserPost,
  MongoUserPostComment,
  MongoUserPostCommentSchema,
  MongoUserPostSchema,
} from './modules/posts/infrastructure/entities';
import {
  MongoAccount,
  MongoAccountSchema,
  MongoUser,
  MongoUserSchema,
} from './modules/users/infrastructure/entities';

seeder({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
    MongooseModule.forRoot(databaseSettings.MONGODB_URI),
    MongooseModule.forFeature([
      // Users
      { name: MongoAccount.name, schema: MongoAccountSchema },
      { name: MongoUser.name, schema: MongoUserSchema },
      // Posts
      {
        name: MongoPost.name,
        schema: MongoPostSchema,
      },
      {
        name: MongoPostComment.name,
        schema: MongoPostCommentSchema,
      },
      {
        name: MongoUserPost.name,
        schema: MongoUserPostSchema,
      },
      {
        name: MongoUserPostComment.name,
        schema: MongoUserPostCommentSchema,
      },
      // Chats
      {
        name: MongoChat.name,
        schema: MongoChatSchema,
      },
      {
        name: MongoMessage.name,
        schema: MongoMessageSchema,
      },
      {
        name: MongoUserMessage.name,
        schema: MongoUserMessageSchema,
      },
      {
        name: MongoUserChat.name,
        schema: MongoUserChatSchema,
      },
    ]),
  ],
}).run([MongoUsersSeeder, MongoPostsSeeder, MongoChatsSeeder]);
