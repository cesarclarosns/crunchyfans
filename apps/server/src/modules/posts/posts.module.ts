import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IUnitOfWork } from '@/common/domain/repositories/unit-of-work';
import { MongoUnitOfWork } from '@/common/infrastructure/repositories/mongo-unit-of-work';
import { MediaModule } from '@/modules/media/infrastructure/media.module';
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
  UserPostSchema,
  UserPostsData,
  UserPostsDataSchema,
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
        name: UserPostsData.name,
        schema: UserPostsDataSchema,
      },
    ]),
    MediaModule,
  ],
  providers: [
    PostsService,
    { provide: IPostsRepository, useClass: MongoPostsRepository },
    { provide: IUnitOfWork, useClass: MongoUnitOfWork },
  ],
})
export class PostsModule {}
