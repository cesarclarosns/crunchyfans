import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatsModule } from '@/features/chats/chats.module';
import { MediaModule } from '@/features/media/media.module';
import { NotificationsModule } from '@/features/notifications/notifications.module';

import { User, UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  exports: [MongooseModule, UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MediaModule,
    forwardRef(() => ChatsModule),
    forwardRef(() => NotificationsModule),
  ],
  providers: [UsersService],
})
export class UsersModule {}
