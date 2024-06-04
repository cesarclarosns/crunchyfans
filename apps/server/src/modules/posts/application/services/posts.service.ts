import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { IUnitOfWorkFactory } from '@/common/domain/repositories/unit-of-work.factory';
import { MediaService } from '@/modules/media/application/services/media.service';
import { CreatePostDto } from '@/modules/posts/domain/dtos/create-post.dto';
import { PostCreatedEvent, POSTS_EVENTS } from '@/modules/posts/domain/events';
import { Post } from '@/modules/posts/domain/models';
import { IPostsRepository } from '@/modules/posts/domain/repositories/posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectPinoLogger(PostsService.name) private readonly _logger: PinoLogger,
    private readonly _eventEmitter: EventEmitter2,
    @Inject(IUnitOfWorkFactory)
    private readonly _unitOfWorkFactory: IUnitOfWorkFactory,
    @Inject(IPostsRepository)
    private readonly _postsRepository: IPostsRepository,
    private readonly _mediaService: MediaService,
  ) {}

  async createPost(create: CreatePostDto): Promise<Post> {
    const uow = this._unitOfWorkFactory.create();

    try {
      const post = await this._postsRepository.createPost(create, uow);

      this._eventEmitter.emit(
        POSTS_EVENTS.postCreated,
        new PostCreatedEvent({ postId: post.id }),
      );

      await uow.commit();
      return post;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.end();
    }
  }

  async getPostsWithViewerData() {}

  async getPostWithViewerDataById() {}

  async getPostById() {}

  async updatePost() {}

  async deletePost() {}
}
