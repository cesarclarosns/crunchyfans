import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { FollowersService } from '@/modules/followers/application/services/followers.service';

/**
 * GET /followers/users/:userId/followers
 * GET /followers/users/:userId/following
 * POST /followers/users/:userId/following/:userId
 * DELETE /followers/users/:userId/following/:userId
 * GET /followers/users/:userId/following/:userId
 */

@Controller('followers')
export class FollowersController {
  constructor(
    @InjectPinoLogger(FollowersController.name)
    private readonly _logger: PinoLogger,
    private readonly _followersService: FollowersService,
  ) {}

  @Get('users/:userId/followers')
  async getUserFollowers(
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {}

  @Get('users/:userId/following')
  async getUserFollowees(
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {}

  @Post('users/:userId/following/:userId')
  async createFollower(@Param('userId') userId: string, @Req() req: Request) {
    const followerId = req.user.sub;

    return followerId;
  }

  @Delete('users/:userId/following/')
  async deleteFollower(@Param('userId') userId: string, @Req() req: Request) {
    const followerId = req.user.sub;
  }
}
