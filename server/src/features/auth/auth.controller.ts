import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { BadRequestResponseBodyDto } from '@/common/dto/bad-request-reponse-body.dto';
import { UnauthorizedResponseBodyDto } from '@/common/dto/unauthorized-reponse-body.dto';
import { config } from '@/config';
import { UserDto } from '@/features/users/dto/user.dto';

import { AUTH_COOKIES } from './auth.constants';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordCallbackDto } from './dto/reset-password-callback.dto';
import { ResetPasswordCallbackQueryDto } from './dto/reset-password-callback-query.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseBodyDto } from './dto/sign-in-response-body.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RefreshTokenGuard } from './guards';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    headers: {
      'Set-Cookie': {
        description:
          'Set cookies: "refreshToken" (httpOnly) and "isAuthenticated". The "refreshToken" cookie will be used to retrieve an accessToken and rotate the refreshToken. The "isAuthenticated" cookie will be used by the client to identify if the user is authenticated.',
      },
    },
    type: SignInResponseBodyDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestResponseBodyDto,
  })
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponseBodyDto> {
    const tokens = await this.authService.signIn(signInDto);

    res.cookie(AUTH_COOKIES.refreshToken, tokens.refreshToken, {
      httpOnly: true,
      path: '/',
    });
    res.cookie(AUTH_COOKIES.isAuthenticated, true, { path: '/' });

    return { accessToken: tokens.accessToken };
  }

  @Post('sign-up')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    type: UserDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestResponseBodyDto,
  })
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signUp(signUpDto);
    const userId = user._id;

    const { accessToken, refreshToken } =
      await this.authService.refreshTokens(userId);

    res.cookie(AUTH_COOKIES.refreshToken, refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    });
    res.cookie(AUTH_COOKIES.isAuthenticated, true, {
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    return { accessToken };
  }

  @Post('sign-out')
  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('refreshToken')
  @ApiOkResponse({
    headers: {
      'Set-Cookie': {
        description: 'Clear cookies: "refreshToken" and "isAuthenticated".',
      },
    },
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(AUTH_COOKIES.refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    });
    res.clearCookie(AUTH_COOKIES.isAuthenticated, {
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    return;
  }

  @Put('password')
  async updatePassword(
    @Req() req: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = req.user.sub;

    updatePasswordDto.userId = userId;

    return await this.authService.updatePassword(updatePasswordDto);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return;
  }

  @Get('reset-password/callback')
  @Public()
  @HttpCode(HttpStatus.OK)
  async resetPasswordCallback(
    @Res({ passthrough: true }) res: Response,
    @Body() resetPasswordCallbackDto: ResetPasswordCallbackDto,
    @Query() query: ResetPasswordCallbackQueryDto,
  ) {
    res.clearCookie(AUTH_COOKIES.refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    });
    res.clearCookie(AUTH_COOKIES.isAuthenticated, {
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    await this.authService.resetPasswordCallback(
      resetPasswordCallbackDto,
      query.token,
    );
    return;
  }

  @Get('refresh')
  @Public()
  @UseGuards(RefreshTokenGuard)
  @ApiResponse({
    headers: {
      'Set-Cookie': {
        description:
          'Set cookies: "refreshToken" (httpOnly) and "isAuthenticated". The "refreshToken" cookie will be used to retrieve an accessToken and rotate the refreshToken. The "isAuthenticated" cookie will be used by the client to identify if the user is authenticated.',
      },
    },
  })
  @ApiCookieAuth('refreshToken')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.sub;

    const { accessToken, refreshToken } =
      await this.authService.refreshTokens(userId);

    res.cookie(AUTH_COOKIES.refreshToken, refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    });
    res.cookie(AUTH_COOKIES.isAuthenticated, true, {
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    return { accessToken };
  }

  @Get('google-oauth')
  @Public()
  @UseGuards(GoogleOAuthGuard)
  async googleOAuth() {}

  @Get('google-oauth/callback')
  @Public()
  @UseGuards(GoogleOAuthGuard)
  async googleOAuthCallback(@Req() req: Request, @Res() res: Response) {
    const userId = req.user.sub;

    const { refreshToken } = await this.authService.refreshTokens(userId);

    res.cookie(AUTH_COOKIES.refreshToken, refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    });
    res.cookie(AUTH_COOKIES.isAuthenticated, true, {
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    const url = config.APP.APP_DOMAIN;
    res.redirect(url);
  }
}
