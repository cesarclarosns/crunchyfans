import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaModule } from '@/modules/media/infrastructure/media.module';
import { PostsService } from '@/modules/posts/application/services/posts.service';
import {
  Post,
  PostComment,
  PostCommentSchema,
  PostSchema,
  UserPost,
  UserPostComment,
  UserPostCommentSchema,
  UserPostSchema,
  UserPostsData,
  UserPostsDataSchema,
} from '@/modules/posts/domain/entities';
import { PostsController } from '@/modules/posts/presentation/controllers/posts.controller';

@Module({
  controllers: [PostsController],
  exports: [PostsService],
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: PostComment.name, schema: PostCommentSchema },
      {
        name: UserPost.name,
        schema: UserPostSchema,
      },
      {
        name: UserPostComment.name,
        schema: UserPostCommentSchema,
      },
      {
        name: UserPostsData.name,
        schema: UserPostsDataSchema,
      },
    ]),
    MediaModule,
  ],
  providers: [PostsService],
})
export class PostsModule {}
