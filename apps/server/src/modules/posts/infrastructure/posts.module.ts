import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaModule } from '../../media/infrastructure/media.module';
import { UsersModule } from '../../users/infrastructure/users.module';
import { Post, PostSchema } from '../domain/entities/post.entity';
import {
  PostComment,
  PostCommentSchema,
} from '../domain/entities/post-comment.entity';
import { UserPost, UserPostSchema } from '../domain/entities/user-post.entity';
import {
  UserPostComment,
  UserPostCommentSchema,
} from '../domain/entities/user-post-comment.entity';
import {
  UserPostsData,
  UserPostsDataSchema,
} from '../domain/entities/user-posts-data.entity';
import { PostsService } from '../application/services/posts.service';
import { PostsController } from '../presentation/controllers/posts.controller';

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
