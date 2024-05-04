import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { seeder } from 'nestjs-seeder';

import { settings } from './config/settings';
import { ChatsSeeder } from './modules/chats/chats.seeder';
import {
  Chat,
  ChatSchema,
} from './modules/chats/infrastructure/schemas/chat.schema';
import {
  LastReadMessagePerUser,
  LastReadMessagePerUserSchema,
} from './modules/chats/infrastructure/schemas/last-read-message-per-user.schema';
import {
  Message,
  MessageSchema,
} from './modules/chats/infrastructure/schemas/message.schema';
import {
  Media,
  MediaSchema,
} from './modules/media/infrastructure/entities/media.entity';
import { MediaSeeder } from './modules/media/infrastructure/media.seeder';
import {
  Post,
  PostSchema,
} from './modules/posts/infrastructure/repositories/mongodb/schemas/post.schema';
import {
  PostComment,
  PostCommentSchema,
} from './modules/posts/infrastructure/repositories/mongodb/schemas/post-comment.schema';
import {
  PostCommentLike,
  PostCommentLikeSchema,
} from './modules/posts/infrastructure/repositories/mongodb/schemas/post-comment-like.schema';
import {
  PostLike,
  PostLikeSchema,
} from './modules/posts/infrastructure/repositories/mongodb/schemas/post-like.schema';
import { PostsSeeder } from './modules/posts/posts.seeder';
import {
  User,
  UserSchema,
} from './modules/users/infrastructure/repositories/mongodb/schemas/user.schema';
import { UsersSeeder } from './modules/users/infrastructure/users.seeder';

seeder({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
    MongooseModule.forRoot(settings.DATABASE.MONGODB_URI),
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
  ],
}).run([MediaSeeder, UsersSeeder, ChatsSeeder, PostsSeeder]);
