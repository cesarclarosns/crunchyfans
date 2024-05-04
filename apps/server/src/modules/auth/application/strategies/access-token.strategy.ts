import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { settings } from '@/config/settings';

import { AUTH_STRATEGIES } from '../../domain/constants/auth-strategies';
import { TokenPayload } from '../../domain/types/token-payload';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.accessToken,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: settings.AUTH.JWT_ACCESS_SECRET,
    });
  }

  validate(payload: TokenPayload) {
    return payload;
  }
}
