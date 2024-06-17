import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { BadRequestResponseBodyDto } from '@/common/domain/dtos/bad-request-reponse-body.dto';
import { appSettings } from '@/config';
import { Public } from '@/modules/auth/application/decorators/public.decorator';
import { RefreshTokenGuard } from '@/modules/auth/application/guards';
import { GoogleGuard } from '@/modules/auth/application/guards/google.guard';
import { AuthService } from '@/modules/auth/application/services/auth.service';
import { TokensService } from '@/modules/auth/application/services/tokens.service';
import { SignInDto } from '@/modules/auth/domain/dtos/sign-in.dto';
import { SignInWithLinkDto } from '@/modules/auth/domain/dtos/sign-in-with-link.dto';
import { SignInWithLinkConsumeDto } from '@/modules/auth/domain/dtos/sign-in-with-link-consume.dto';
import { SignUpDto } from '@/modules/auth/domain/dtos/sign-up.dto';
import { TokensDto } from '@/modules/auth/domain/dtos/tokens.dto';
import { UpdatePasswordDto } from '@/modules/auth/domain/dtos/update-password.dto';
import { AuthCookies, AuthTokens } from '@/modules/auth/domain/enums';
import { UsersService } from '@/modules/users/application/services/users.service';
import { UserDto } from '@/modules/users/domain/dtos/user.dto';

@ApiTags('auth')
@ApiBearerAuth(AuthTokens.accessToken)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly _eventEmitter: EventEmitter2,
    private readonly _usersService: UsersService,
    private readonly _authService: AuthService,
    private readonly _tokensService: TokensService,
  ) {}

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    headers: {
      'Set-Cookie': {
        description:
          'Set cookie "refreshToken" (httpOnly). The "refreshToken" cookie will be used to retrieve an accessToken and rotate the refreshToken.',
      },
    },
    type: TokensDto,
  })
  @ApiBadRequestResponse()
  async signIn(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: SignInDto,
  ) {
    body.userAgent = req.headers['user-agent']!;
    body.ip =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress!;

    const tokens = await this._authService.signIn(body);

    res.cookie(AuthCookies.refreshToken, tokens.refreshToken, {
      httpOnly: true,
      path: '/',
    });

    return tokens;
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    type: UserDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestResponseBodyDto,
  })
  async signUp(@Body() body: SignUpDto) {
    const user = await this._authService.signUp(body);
    return user;
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiCookieAuth('refreshToken')
  @ApiResponse({
    headers: {
      'Set-Cookie': {
        description:
          'Set cookie "refreshToken" (httpOnly). The "refreshToken" cookie will be used to retrieve an accessToken and rotate the refreshToken.',
      },
    },
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.sub;

    const tokens = await this._tokensService.refreshTokens(userId);

    res.cookie(AuthCookies.refreshToken, tokens.refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    return tokens;
  }

  @Patch('user/password')
  async updateUserPassword(
    @Req() req: Request,
    @Body() body: UpdatePasswordDto,
  ) {
    const userId = req.user.sub;

    return await this._authService.updateUserPassword(userId, body);
  }

  @Public()
  @Get('signin/link')
  async signInWithLink(@Req() req: Request, @Query() query: SignInWithLinkDto) {
    query.userAgent = req.headers['user-agent']!;
    query.ip =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress!;

    return await this._authService.signInWithLink(query);
  }

  @Get('signin/link/consume')
  async signInWithLinkConsume(@Query() query: SignInWithLinkConsumeDto) {
    const tokens = await this._authService.signInWithLinkConsume(query);
    return tokens;
  }

  @Public()
  @UseGuards(GoogleGuard)
  @Get('signinup/google')
  async signinupInWithGoogle() {}

  @Public()
  @UseGuards(GoogleGuard)
  @Get('signinup/google/callback')
  async signinupInWithGoogleCallback(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user.sub;

    const tokens = await this._tokensService.refreshTokens(userId);

    res.cookie(AuthCookies.refreshToken, tokens.refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: true,
    });

    const url = appSettings.APP_DOMAIN;
    res.redirect(url);
  }
}
