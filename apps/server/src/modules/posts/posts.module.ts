import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IUnitOfWorkFactory } from '@/common/domain/repositories/unit-of-work.factory';
import { MongoUnitOfWorkFactory } from '@/common/infrastructure/repositories/mongo-unit-of-work.factory';
import { MediaModule } from '@/modules/media/media.module';
import { PostsService } from '@/modules/posts/application/services/posts.service';
import { IPostsRepository } from '@/modules/posts/domain/repositories/posts.repository';
import {
  MongoPost,
  MongoPostComment,
  MongoPostCommentSchema,
  MongoPostSchema,
  MongoUserPost,
  MongoUserPostComment,
  MongoUserPostCommentSchema,
  MongoUserPosts,
  MongoUserPostSchema,
  MongoUserPostsSchema,
} from '@/modules/posts/infrastructure/entities';
import { MongoPostsRepository } from '@/modules/posts/infrastructure/repositories';
import { PostsController } from '@/modules/posts/presentation/controllers/posts.controller';

@Module({
  controllers: [PostsController],
  exports: [PostsService, IPostsRepository],
  imports: [
    MongooseModule.forFeature([
      { name: MongoPost.name, schema: MongoPostSchema },
      { name: MongoPostComment.name, schema: MongoPostCommentSchema },
      {
        name: MongoUserPost.name,
        schema: MongoUserPostSchema,
      },
      {
        name: MongoUserPostComment.name,
        schema: MongoUserPostCommentSchema,
      },
      {
        name: MongoUserPosts.name,
        schema: MongoUserPostsSchema,
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
