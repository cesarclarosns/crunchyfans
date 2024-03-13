import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { Public } from '../auth/decorators/public.decorator';
import { OptionalAccessTokenGuard } from '../auth/guards/optional-access-token.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { FindAllPostCommentsDto } from './dto/find-all-post-comments.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { GetFeedDto } from './dto/get-feed.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
    const userId = req.user.sub;

    createPostDto.userId = userId;

    return await this.postsService.createPost(createPostDto);
  }

  @Public()
  @UseGuards(OptionalAccessTokenGuard)
  @Get()
  async findAllPosts(
    @Req() req: Request,
    @Query() findAllPostsDto: FindAllPostsDto,
  ) {
    const userId = req?.user?.sub;

    if (userId) findAllPostsDto.userId = userId;

    return await this.postsService.findAllPosts(findAllPostsDto);
  }

  @Get('feed')
  async getFeed(@Req() req: Request, @Query() getFeedDto: GetFeedDto) {
    const userId = req.user.sub;

    getFeedDto.userId = userId;

    // return await this.postsService.getFeed(getFeedDto);
  }

  @Get(':postId')
  async findOnePost(@Req() req: Request, @Param('postId') postId: string) {
    const userId = req.user.sub;

    return await this.postsService.findOnePost({ postId, requesterId: userId });
  }

  @Patch(':postId')
  async updatePost(
    @Req() req: Request,
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const userId = req.user.sub;

    return await this.postsService.updatePost(
      { _id: postId, userId },
      updatePostDto,
    );
  }

  @Delete(':postId')
  async removePost(@Req() req: Request, @Param('postId') postId: string) {
    const userId = req.user.sub;

    return await this.postsService.removePost({ _id: postId, userId });
  }

  @Post(':postId/likes')
  async createPostLike(@Req() req: Request, @Param('postId') postId: string) {
    const userId = req.user.sub;

    return await this.postsService.createPostLike({ postId, userId });
  }

  @Delete(':postId/likes')
  async deletePostLike(@Req() req: Request, @Param('postId') postId: string) {
    const userId = req.user.sub;

    return await this.postsService.deletePostLike({ postId, userId });
  }

  @Post(':postId/comments')
  async createPostComment(
    @Req() req: Request,
    @Param('postId') postId: string,
    @Body() createPostCommentDto: CreatePostCommentDto,
  ) {
    const userId = req.user.sub;

    createPostCommentDto.postId = postId;
    createPostCommentDto.userId = userId;

    return await this.postsService.createPostComment(createPostCommentDto);
  }

  @Get(':postId/comments')
  async findAllPostComments(
    @Req() req: Request,
    @Param('postId') postId: string,
    @Query() findAllPostCommentsDto: FindAllPostCommentsDto,
  ) {
    const userId = req.user.sub;

    findAllPostCommentsDto.postId = postId;
    findAllPostCommentsDto.userId = userId;

    return await this.postsService.findAllPostComments(findAllPostCommentsDto);
  }

  @Patch(':postId/comments/:commentId')
  async updatePostComment(
    @Req() req: Request,
    @Param('commentId') commentId: string,
    @Body() updatePostCommentDto: UpdatePostCommentDto,
  ) {
    const userId = req.user.sub;

    return await this.postsService.updatePostComment(
      { _id: commentId, userId },
      updatePostCommentDto,
    );
  }

  @Delete(':postId/comments/:postCommentId')
  async deletePostComment(
    @Req() req: Request,
    @Param('postCommentId') postCommentId: string,
  ) {
    const userId = req.user.sub;

    return await this.postsService.deletePostComment({ postCommentId, userId });
  }

  @Post(':postId/comments/:postCommentId/likes')
  async createPostCommentLike(
    @Req() req: Request,
    @Param('postCommentId') postCommentId: string,
  ) {
    const userId = req.user.sub;

    return await this.postsService.createPostCommentLike({
      postCommentId,
      userId,
    });
  }

  @Delete(':postId/comments/:postCommentId/likes')
  async deletePostCommentLike(
    @Req() req: Request,
    @Param('postCommentId') postCommentId: string,
  ) {
    const userId = req.user.sub;

    return await this.postsService.deletePostCommentLike({
      postCommentId,
      userId,
    });
  }
}
