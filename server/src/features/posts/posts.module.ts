import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaModule } from '../media/media.module';
import { UsersModule } from '../users/users.module';
import { Post, PostSchema } from './entities/post.entity';
import { PostComment, PostCommentSchema } from './entities/post-comment.entity';
import {
  PostCommentLike,
  PostCommentLikeSchema,
} from './entities/post-comment-like.entity';
import { PostLike, PostLikeSchema } from './entities/post-like.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  imports: [
    UsersModule,
    MediaModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: PostComment.name, schema: PostCommentSchema },
      { name: PostCommentLike.name, schema: PostCommentLikeSchema },
    ]),
  ],
  providers: [PostsService],
})
export class PostsModule {}
