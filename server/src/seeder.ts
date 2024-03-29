import { Global, Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { seeder } from 'nestjs-seeder';

import { config } from './config';
import { AuthModule } from './features/auth/auth.module';
import { ChatsSeeder } from './features/chats/chats.seeder';
import { Chat, ChatSchema } from './features/chats/entities/chat.entity';
import {
  LastReadMessagePerUser,
  LastReadMessagePerUserSchema,
} from './features/chats/entities/last-read-message-per-user.entity';
import {
  Message,
  MessageSchema,
} from './features/chats/entities/message.entity';
import { Media, MediaSchema } from './features/media/entities/media.entity';
import { MediaSeeder } from './features/media/media.seeder';
import { Post, PostSchema } from './features/posts/entities/post.entity';
import {
  PostComment,
  PostCommentSchema,
} from './features/posts/entities/post-comment.entity';
import {
  PostCommentLike,
  PostCommentLikeSchema,
} from './features/posts/entities/post-comment-like.entity';
import {
  PostLike,
  PostLikeSchema,
} from './features/posts/entities/post-like.entity';
import { PostsSeeder } from './features/posts/posts.seeder';
import { User, UserSchema } from './features/users/entities/user.entity';
import { UsersModule } from './features/users/users.module';
import { UsersSeeder } from './features/users/users.seeder';

@Global()
@Module({
  exports: [EventEmitter2],
  providers: [{ provide: EventEmitter2, useValue: {} }],
})
class BaseModule {}

seeder({
  imports: [
    BaseModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
    MongooseModule.forRoot(config.DATABASE.URI),
    MongooseModule.forFeature([
      // Media
      {
        name: Media.name,
        schema: MediaSchema,
      },
      // Users
      {
        name: User.name,
        schema: UserSchema,
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
        name: LastReadMessagePerUser.name,
        schema: LastReadMessagePerUserSchema,
      },
      // Posts
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: PostLike.name,
        schema: PostLikeSchema,
      },
      {
        name: PostComment.name,
        schema: PostCommentSchema,
      },
      {
        name: PostCommentLike.name,
        schema: PostCommentLikeSchema,
      },
    ]),
    AuthModule,
    UsersModule,
  ],
}).run([MediaSeeder, UsersSeeder, ChatsSeeder, PostsSeeder]);
