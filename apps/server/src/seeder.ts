import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { seeder } from 'nestjs-seeder';

import { databaseSettings } from '@/config';
import { MongoChatsSeeder } from '@/modules/chats/infrastructure/seeders';
import { MongoMediaSeeder } from '@/modules/media/infrastructure/seeders';
import { MongoPostsSeeder } from '@/modules/posts/infrastructure/seeders';
import { MongoUsersSeeder } from '@/modules/users/infrastructure/seeders';

import {
  Chat,
  ChatSchema,
  Message,
  MessageSchema,
  UserChat,
  UserChatSchema,
  UserMessage,
  UserMessageSchema,
} from './modules/chats/infrastructure/repositories/mongo/entities';
import {
  Media,
  MediaSchema,
} from './modules/media/infrastructure/repositories/entities';
import {
  Post,
  PostComment,
  PostCommentSchema,
  PostSchema,
  UserPost,
  UserPostComment,
  UserPostCommentSchema,
  UserPostSchema,
} from './modules/posts/infrastructure/repositories/mongo/entities';
import {
  Account,
  AccountSchema,
  User,
  UserSchema,
} from './modules/users/infrastructure/repositories/mongo/entities';

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
      { name: Account.name, schema: AccountSchema },
      { name: User.name, schema: UserSchema },
      // Media
      { name: Media.name, schema: MediaSchema },
      // Posts
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: PostComment.name,
        schema: PostCommentSchema,
      },
      {
        name: UserPost.name,
        schema: UserPostSchema,
      },
      {
        name: UserPostComment.name,
        schema: UserPostCommentSchema,
      },
      // Chats
      {
        name: Chat.name,
        schema: ChatSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
      {
        name: UserMessage.name,
        schema: UserMessageSchema,
      },
      {
        name: UserChat.name,
        schema: UserChatSchema,
      },
    ]),
  ],
}).run([
  MongoUsersSeeder,
  MongoPostsSeeder,
  MongoMediaSeeder,
  MongoChatsSeeder,
]);
