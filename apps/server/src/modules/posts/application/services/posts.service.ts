import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { IUnitOfWorkFactory } from '@/common/domain/repositories/unit-of-work.factory';
import { MediaService } from '@/modules/media/application/services/media.service';
import {
  PostCreatedEvent,
  PostsDomainEvents,
} from '@/modules/posts/domain/domain-events';
import { CreatePostDto } from '@/modules/posts/domain/dtos/create-post.dto';
import { GetPostsDto } from '@/modules/posts/domain/dtos/get-posts.dto';
import { UpdatePostDto } from '@/modules/posts/domain/dtos/update-post.dto';
import { Post, PostWithViewerData } from '@/modules/posts/domain/entities';
import { IPostsRepository } from '@/modules/posts/domain/repositories/posts.repository';

export interface IPostsService {
  createPost: (create: CreatePostDto) => Promise<Post>;
  getPostsWithViewerData: (
    filter: GetPostsDto,
    viewerId: string,
  ) => Promise<PostWithViewerData[]>;
  getPostWithViewerDataById: (
    postId: string,
    viewerId: string,
  ) => Promise<PostWithViewerData | null>;
  getPostById: (postId: string) => Promise<Post | null>;
  updatePost: (postId: string, update: UpdatePostDto) => Promise<Post | null>;
  deletePost: (postId: string) => Promise<Post | null>;
}

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

      this._eventEmitter.emit(PostsDomainEvents.postCreated, {
        postId: post.id,
      } satisfies PostCreatedEvent);

      await uow.commit();

      return post;
    } catch (error) {
      await uow.rollback();
      throw error;
    }
  }

  async getPostsWithViewerData() {}

  async getPostWithViewerDataById() {}

  async getPostById() {}

  async updatePost() {}

  async deletePost() {}
}
