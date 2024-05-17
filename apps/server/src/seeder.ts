import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { seeder } from 'nestjs-seeder';

import { settings } from './config/settings';
import {
  Chat,
  ChatSchema,
} from './modules/chats/domain/entities/chat.entity';
import {
  LastReadMessagePerUser,
  LastReadMessagePerUserSchema,
} from './modules/chats/domain/entities/user-chat.entity';
import {
  Message,
  MessageSchema,
} from './modules/chats/domain/entities/message.entity';
import { ChatsSeeder } from './modules/chats/presentation/chats.seeder';
import {
  Media,
  MediaSchema,
} from './modules/media/domain/entities/media.entity';
import { MediaSeeder } from './modules/media/infrastructure/media.seeder';
import { PostsSeeder } from './modules/posts/infrastructure/posts.seeder';
import {
  Post,
  PostSchema,
} from './modules/posts/domain/entities/post.entity';
import {
  PostComment,
  PostCommentSchema,
} from './modules/posts/domain/entities/post-comment.entity';
import {
  PostCommentLike,
  PostCommentLikeSchema,
} from './modules/posts/domain/entities/user-post-comment.entity';
import {
  PostLike,
  PostLikeSchema,
} from './modules/posts/domain/entities/post-like.entity';
import {
  User,
  UserSchema,
} from './modules/users/domain/entities/user.entity';
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
    MongooseModule.forRoot(settings.DATABASES.MONGODB_URI),
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
