import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { seeder } from 'nestjs-seeder';

import { settings } from '@/config/settings';
import { ChatsModule } from '@/modules/chats/chats.module';
import { ChatsSeeder } from '@/modules/chats/presentation/chats.seeder';
import { MediaSeeder } from '@/modules/media/infrastructure/media.seeder';
import { MediaModule } from '@/modules/media/media.module';
import { PostsSeeder } from '@/modules/posts/infrastructure/posts.seeder';
import { PostsModule } from '@/modules/posts/posts.module';
import { UsersSeeder } from '@/modules/users/infrastructure/users.seeder';
import { UsersModule } from '@/modules/users/users.module';

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
    MediaModule,
    UsersModule,
    ChatsModule,
    PostsModule,
  ],
}).run([MediaSeeder, UsersSeeder, ChatsSeeder, PostsSeeder]);
