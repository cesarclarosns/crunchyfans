import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { PostsService } from '@/modules/posts/application/services/posts.service';
import { IPostsRepository } from '@/modules/posts/domain/repositories/posts.repository';

@Controller('posts')
export class PostsController {
  constructor(
    @InjectPinoLogger(PostsController.name)
    private readonly _logger: PinoLogger,
    @Inject(IPostsRepository)
    private readonly _postsRepository: IPostsRepository,
    private readonly _postsService: PostsService,
  ) {}

  // @Post()
  // async createPost(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
  //   const userId = req.user.sub;

  //   createPostDto.userId = userId;

  //   return await this.postsService.createPost(createPostDto);
  // }

  // @Public()
  // @UseGuards(OptionalAccessTokenGuard)
  // @Get()
  // async findAllPosts(
  //   @Req() req: Request,
  //   @Query() findAllPostsDto: FindAllPostsDto,
  // ) {
  //   const userId = req.user.sub;

  //   return await this.postsService.findAllPosts(findAllPostsDto);
  // }

  // @Get('feed')
  // async getFeed(@Req() req: Request) {
  //   const userId = req.user.sub;

  //   const getFeedDto = new GetFeedDto();
  //   getFeedDto.toUserId = userId;
  // }

  // @Get(':postId')
  // async findOnePost(@Req() req: Request, @Param('postId') postId: string) {
  //   const userId = req.user.sub;

  //   return await this.postsService.findOnePostById(postId);
  // }

  // @Patch(':postId')
  // async updatePost(
  //   @Req() req: Request,
  //   @Param('postId') postId: string,
  //   @Body() updatePostDto: UpdatePostDto,
  // ) {
  //   const userId = req.user.sub;

  //   return await this.postsService.updatePost(postId, updatePostDto);
  // }

  // @Delete(':postId')
  // async removePost(@Req() req: Request, @Param('postId') postId: string) {
  //   const userId = req.user.sub;

  //   return await this.postsService.removePost(postId);
  // }

  // @Post(':postId/likes')
  // async createPostLike(@Req() req: Request, @Param('postId') postId: string) {
  //   const userId = req.user.sub;

  //   return await this.postsService.createPostLike({ postId, userId });
  // }

  // @Delete(':postId/likes')
  // async deletePostLike(@Req() req: Request, @Param('postId') postId: string) {
  //   const userId = req.user.sub;

  //   return await this.postsService.deletePostLike({ postId, userId });
  // }

  // @Post(':postId/comments')
  // async createPostComment(
  //   @Req() req: Request,
  //   @Param('postId') postId: string,
  //   @Body() createPostCommentDto: CreatePostCommentDto,
  // ) {
  //   const userId = req.user.sub;

  //   createPostCommentDto.postId = postId;
  //   createPostCommentDto.userId = userId;

  //   return await this.postsService.createPostComment(createPostCommentDto);
  // }

  // @Get(':postId/comments')
  // async findAllPostComments(
  //   @Req() req: Request,
  //   @Param('postId') postId: string,
  //   @Query() findAllPostCommentsDto: FindAllPostCommentsDto,
  // ) {
  //   const userId = req.user.sub;

  //   findAllPostCommentsDto.postId = postId;
  //   findAllPostCommentsDto.toUserId = userId;

  //   return await this.postsService.findAllPostComments(findAllPostCommentsDto);
  // }

  // @Patch(':postId/comments/:postCommentId')
  // async updatePostComment(
  //   @Req() req: Request,
  //   @Param('postCommentId') postCommentId: string,
  //   @Body() updatePostCommentDto: UpdatePostCommentDto,
  // ) {
  //   const userId = req.user.sub;

  //   return await this.postsService.updatePostComment(
  //     postCommentId,
  //     updatePostCommentDto,
  //   );
  // }

  // @Delete(':postId/comments/:postCommentId')
  // async deletePostComment(
  //   @Req() req: Request,
  //   @Param('postCommentId') postCommentId: string,
  // ) {
  //   const userId = req.user.sub;

  //   return await this.postsService.deletePostComment(postCommentId);
  // }

  // @Post(':postId/comments/:postCommentId/likes')
  // async createPostCommentLike(
  //   @Req() req: Request,
  //   @Param('postCommentId') postCommentId: string,
  // ) {
  //   const userId = req.user.sub;

  //   return await this.postsService.createPostCommentLike({
  //     postCommentId,
  //     userId,
  //   });
  // }

  // @Delete(':postId/comments/:postCommentId/likes')
  // async deletePostCommentLike(
  //   @Req() req: Request,
  //   @Param('postCommentId') postCommentId: string,
  // ) {
  //   const userId = req.user.sub;

  //   return await this.postsService.deletePostCommentLike({
  //     postCommentId,
  //     userId,
  //   });
  // }
}
