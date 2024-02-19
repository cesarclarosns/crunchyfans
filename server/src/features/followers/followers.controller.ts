import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { CreateFollowerDto } from './dto/create-follower.dto';
import { FindAllFolloweesDto } from './dto/find-all-followees.dto';
import { FindAllFollowersDto } from './dto/find-all-followers.dto';
import { RemoveFollowerDto } from './dto/remove-follower.dto';
import { FollowersService } from './followers.service';

@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post()
  async create(@Body() createFollowerDto: CreateFollowerDto) {
    return await this.followersService.create(createFollowerDto);
  }

  @Get(':userId')
  async findAllFollowers(
    @Param('userId') userId: string,
    @Query() findAllFollowersDto: FindAllFollowersDto,
  ) {
    findAllFollowersDto.target = userId;

    return await this.followersService.findAllFollowers(findAllFollowersDto);
  }

  @Get(':userId/followees')
  async findAllFollowees(
    @Param('userId') userId: string,
    @Query() findAllFolloweesDto: FindAllFolloweesDto,
  ) {
    findAllFolloweesDto.target = userId;

    return await this.followersService.findAllFollowees(findAllFolloweesDto);
  }

  @Delete()
  remove(@Query() removeFollowerDto: RemoveFollowerDto) {
    return this.followersService.remove(removeFollowerDto);
  }
}
