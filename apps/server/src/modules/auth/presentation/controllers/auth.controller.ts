import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Put,
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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { BadRequestResponseBodyDto } from '@/common/domain/dtos/bad-request-reponse-body.dto';
import { UnauthorizedResponseBodyDto } from '@/common/domain/dtos/unauthorized-reponse-body.dto';
import { settings } from '@/config/settings';
import { UserDto } from '@/modules/users/domain/dtos/user.dto';

import { UsersService } from '../../../users/application/services/users.service';
import { Public } from '../../application/decorators/public.decorator';
import { AUTH_EVENTS } from '../../application/events';
import { SignInWithPasswordlessEvent } from '../../application/events/sign-in-with-passwordless.event';
import { RefreshTokenGuard } from '../../application/guards';
import { GoogleGuard } from '../../application/guards/google.guard';
import { AuthService } from '../../auth.service';
import { AUTH_COOKIES } from '../../domain/constants/auth-cookies';
import { AUTH_TOKENS } from '../../domain/constants/auth-tokens';
import { SignInDto } from '../../domain/dtos/sign-in.dto';
import { SignInWithPasswordlessDto } from '../../domain/dtos/sign-in-with-passwordless.dto';
import { SignInWithPasswordlessRedirectDto } from '../../domain/dtos/sign-in-with-passwordless-redirect.dto';
import { SignUpDto } from '../../domain/dtos/sign-up.dto';
import { TokensDto } from '../../domain/dtos/tokens.dto';
import { UpdatePasswordDto } from '../../domain/dtos/update-password.dto';

/**
 * POST /signin
 * POST /signup
 * POST /signout
 *
 * PATCH /user/password
 * POST /refresh
 *
 * POST /signin/link
 * POST /signin/link/resend
 * POST /signin/link/consume
 *
 * GET /signinup/google
 * GET /signinup/google/callback
 */

@ApiTags('auth')
@ApiBearerAuth(AUTH_TOKENS.accessToken)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
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
    @Res({ passthrough: true }) res: Response,
    @Body() body: SignInDto,
  ) {
    const tokens = await this.authService.signIn(body);

    res.cookie(AUTH_COOKIES.refreshToken, tokens.refreshToken, {
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
  async signUp(
    @Body() body: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signUp(body);

    const tokens = await this.authService.refreshTokens(user.id);

    res.cookie(AUTH_COOKIES.refreshToken, tokens.refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    return tokens;
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

    const tokens = await this.authService.refreshTokens(userId);

    res.cookie(AUTH_COOKIES.refreshToken, tokens.refreshToken, {
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

    return await this.authService.updatePassword(userId, body);
  }

  @Public()
  @Get('signin/link')
  async signInWithLink(@Query() query: SignInWithPasswordlessDto) {}

  @Get('signin/link/consume')
  async signInWithLinkConsume() {}

  @Public()
  @UseGuards(GoogleGuard)
  @Get('signinup/google')
  async signInWithGoogle() {}

  @Public()
  @UseGuards(GoogleGuard)
  @Get('signinup/google/callback')
  async signInWithGoogleRedirect(@Req() req: Request, @Res() res: Response) {
    const userId = req.user.sub;

    const tokens = await this.authService.refreshTokens(userId);

    res.cookie(AUTH_COOKIES.refreshToken, tokens.refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    const url = settings.APP.DOMAIN;
    res.redirect(url);
  }
}
