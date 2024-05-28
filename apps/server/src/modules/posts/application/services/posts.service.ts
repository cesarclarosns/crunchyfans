import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { IUnitOfWork } from '@/common/domain/repositories/unit-of-work';
import { MongoUnitOfWork } from '@/common/infrastructure/repositories/mongo-unit-of-work';
import { MediaService } from '@/modules/media/application/services/media.service';
import { CreatePostDto } from '@/modules/posts/domain/dtos/create-post.dto';
import { PostCreatedEvent, POSTS_EVENTS } from '@/modules/posts/domain/events';

import { IPostsRepository } from '../../domain/repositories/posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectPinoLogger(PostsService.name) private readonly _logger: PinoLogger,
    private readonly _eventEmitter: EventEmitter2,
    private readonly _unitOfWork: IUnitOfWork,
    @Inject(IPostsRepository)
    private readonly _postsRepository: IPostsRepository,
    private readonly _mediaService: MediaService,
  ) {}

  async createPost(create: CreatePostDto) {
    const dbContext = await this._unitOfWork.start();

    try {
      const post = await this._postsRepository.createPost(create, dbContext);

      this._eventEmitter.emit(
        POSTS_EVENTS.postCreated,
        new PostCreatedEvent({ postId: post.id }),
      );

      await this._unitOfWork.commit(dbContext);
    } catch {
      await this._unitOfWork.rollback(dbContext);
    } finally {
      await this._unitOfWork.end(dbContext);
    }
  }

  async getPostsWithViewerData() {}

  async getPostWithViewerDataById() {}

  async getPostById() {}

  async updatePost() {}

  async deletePost() {}
}
