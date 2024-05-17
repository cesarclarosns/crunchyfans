import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { string } from 'zod';

/**
 *  POST /followers/:userId
 *  DELETE /followers/:userId
 *  GET /followers/:userId/followers
 *  GET /followers/:userId/following
 */

@Controller('followers')
export class FollowersController {
  @Post(':userId')
  async createFollower(@Param('userId') userId: string, @Req() req: Request) {
    const followerId = req.user.sub;

    return followerId;
  }

  @Get(':userId/followers')
  async findAllFollowers(
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {}

  @Get(':userId/followees')
  async findAllFollowees(
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {}

  @Delete(':userId')
  async removeFollower(@Param('userId') userId: string, @Req() req: Request) {
    const followerId = req.user.sub;
  }
}