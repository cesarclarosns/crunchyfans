import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { Public } from '../../../auth/application/decorators/public.decorator';
import { OptionalAccessTokenGuard } from '../../../auth/application/guards/optional-access-token.guard';
import { PostsService } from '../../application/services/posts.service';
import { CreatePostDto } from '../../domain/dtos/create-post.dto';
import { CreatePostCommentDto } from '../../domain/dtos/create-post-comment.dto';
import { FindAllPostCommentsDto } from '../../domain/dtos/get-post-comments.dto';
import { FindAllPostsDto } from '../../domain/dtos/find-all-posts.dto';
import { GetFeedDto } from '../../domain/dtos/get-feed.dto';
import { UpdatePostDto } from '../../domain/dtos/update-post.dto';
import { UpdatePostCommentDto } from '../../domain/dtos/update-post-comment.dto';

/**
 * POST /
 * GET /
 * GET /:id
 *
 */

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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
