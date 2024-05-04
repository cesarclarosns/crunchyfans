import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaModule } from '../media/media.module';
import { UsersModule } from '../users/users.module';
import { PostsController } from './presentation/controllers/posts.controller';
import {
  Post,
  PostSchema,
} from './infrastructure/repositories/mongodb/schemas/post.schema';
import {
  PostComment,
  PostCommentSchema,
} from './infrastructure/repositories/mongodb/schemas/post-comment.schema';
import {
  PostCommentLike,
  PostCommentLikeSchema,
} from './infrastructure/repositories/mongodb/schemas/post-comment-like.schema';
import {
  PostLike,
  PostLikeSchema,
} from './infrastructure/repositories/mongodb/schemas/post-like.schema';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: PostComment.name, schema: PostCommentSchema },
      { name: PostCommentLike.name, schema: PostCommentLikeSchema },
    ]),
    MediaModule,
  ],
  providers: [PostsService],
})
export class PostsModule {}
