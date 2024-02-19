import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { config } from '@/config';

import { AUTH_STRATEGIES } from '../auth.constants';
import { TokenPayload } from '../auth.types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.accessToken,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.AUTH.JWT_ACCESS_SECRET,
    });
  }

  validate(payload: TokenPayload) {
    return payload;
  }
}
