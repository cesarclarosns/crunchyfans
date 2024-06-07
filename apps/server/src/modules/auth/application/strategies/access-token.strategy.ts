import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { authSettings } from '@/config';
import { AUTH_STRATEGIES } from '@/modules/auth/domain/constants/auth-strategies';
import { TokenPayload } from '@/modules/auth/domain/types/token-payload';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.accessToken,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authSettings.JWT_ACCESS_SECRET,
    });
  }

  validate(payload: TokenPayload) {
    return payload;
  }
}
