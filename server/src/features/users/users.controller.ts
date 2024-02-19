import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { Public } from '../auth/decorators/public.decorator';
import { OptionalAccessTokenGuard } from '../auth/guards/optional-access-token.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() findAllUsersDto: FindAllUsersDto) {
    return await this.usersService.findAll(findAllUsersDto);
  }

  @Get('me')
  async findMyInfo(@Req() req: Request) {
    const user_id = req.user.sub;
    return await this.usersService.findInfoById(user_id);
  }

  @Get(':userId')
  async findInfo(@Param('userId') userId: string) {
    return await this.usersService.findInfoById(userId);
  }

  @Patch(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(userId, updateUserDto);
  }

  @Public()
  @UseGuards(OptionalAccessTokenGuard)
  @Get(':username/profile')
  async findProfile(@Req() req: Request, @Param('username') username: string) {
    const userId = req?.user?.sub;

    return await this.usersService.findProfileByUsername({
      requesterId: userId,
      username,
    });
  }
}
