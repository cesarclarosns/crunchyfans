import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { authSettings } from '@/config';
import { AuthCookies } from '@/modules/auth/domain/enums/auth-cookies';
import { AuthStrategies } from '@/modules/auth/domain/enums/auth-strategies';
import { TokenPayload } from '@/modules/auth/domain/types/token-payload';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  AuthStrategies.refreshToken,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      passReqToCallback: true,
      secretOrKey: authSettings.JWT_REFRESH_SECRET,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      AuthCookies.refreshToken in req.cookies &&
      req.cookies.refreshToken.length > 0
    ) {
      return req.cookies[AuthCookies.refreshToken];
    }

    return null;
  }

  validate(req: Request, payload: TokenPayload) {
    return payload;
  }
}
