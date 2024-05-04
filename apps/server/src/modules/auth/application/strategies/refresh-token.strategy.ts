import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { settings } from '@/config/settings';

import { AUTH_COOKIES } from '../../domain/constants/auth-cookies';
import { AUTH_STRATEGIES } from '../../domain/constants/auth-strategies';
import { TokenPayload } from '../../domain/types/token-payload';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.refreshToken,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      passReqToCallback: true,
      secretOrKey: settings.AUTH.JWT_REFRESH_SECRET,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      AUTH_COOKIES.refreshToken in req.cookies &&
      req.cookies.refreshToken.length > 0
    ) {
      return req.cookies[AUTH_COOKIES.refreshToken];
    }

    return null;
  }

  validate(req: Request, payload: TokenPayload) {
    return payload;
  }
}
