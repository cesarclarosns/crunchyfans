import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IUnitOfWorkFactory } from '@/common/domain/repositories/unit-of-work.factory';
import { MongoUnitOfWorkFactory } from '@/common/infrastructure/repositories/mongo-unit-of-work.factory';
import { MediaModule } from '@/modules/media/media.module';
import { PostsService } from '@/modules/posts/application/services/posts.service';
import { IPostsRepository } from '@/modules/posts/domain/repositories/posts.repository';
import {
  Post,
  PostComment,
  PostCommentSchema,
  PostSchema,
  UserPost,
  UserPostComment,
  UserPostCommentSchema,
  UserPosts,
  UserPostSchema,
  UserPostsSchema,
} from '@/modules/posts/infrastructure/repositories/mongo/entities';
import { MongoPostsRepository } from '@/modules/posts/infrastructure/repositories/mongo/mongo-posts.repository';
import { PostsController } from '@/modules/posts/presentation/controllers/posts.controller';

@Module({
  controllers: [PostsController],
  exports: [PostsService, IPostsRepository],
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
        name: UserPosts.name,
        schema: UserPostsSchema,
      },
    ]),
    MediaModule,
  ],
  providers: [
    PostsService,
    { provide: IUnitOfWorkFactory, useClass: MongoUnitOfWorkFactory },
    { provide: IPostsRepository, useClass: MongoPostsRepository },
  ],
})
export class PostsModule {}
