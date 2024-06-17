import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { Public } from '@/modules/auth/application/decorators/public.decorator';
import { OptionalAccessTokenGuard } from '@/modules/auth/application/guards/optional-access-token.guard';

import { UsersService } from '../../application/services/users.service';
import { CreateUserDto } from '../../domain/dtos/create-user.dto';
import { GetUsersProfileBasicDto } from '../../domain/dtos/get-users-profile-basic.dto';
import { UpdateUserDto } from '../../domain/dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    @InjectPinoLogger(UsersController.name)
    private readonly _logger: PinoLogger,
    private readonly _usersService: UsersService,
  ) {}

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Post()
  // async createUser(@Body() body: CreateUserDto) {
  //   return await this.usersService.createUser(body);
  // }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Get()
  // async getUsersProfileBasic(@Query() query: GetUsersProfileBasicDto) {
  //   return await this.usersService.findAllUsersBasicProfile({});
  // }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Get('me')
  // async getUserData(@Req() req: Request) {
  //   const userId = req.user.sub;

  //   return await this.usersService.findOneUserById(userId);
  // }

  // @Get(':id')
  // async getUser() {}

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Patch(':id')
  // async updateUser(@Param('id') userId: string, @Body() body: UpdateUserDto) {
  //   return await this.usersService.updateUser(userId, body);
  // }

  // @Public()
  // @UseGuards(OptionalAccessTokenGuard)
  // @UseInterceptors(ClassSerializerInterceptor)
  // @Get(':username/profile')
  // async getUserProfile(
  //   @Req() req: Request,
  //   @Param('username') username: string,
  // ) {}
}
