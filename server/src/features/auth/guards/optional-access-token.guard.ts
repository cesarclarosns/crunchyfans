import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AUTH_STRATEGIES } from '../auth.constants';

@Injectable()
export class OptionalAccessTokenGuard extends AuthGuard(
  AUTH_STRATEGIES.accessToken,
) {
  handleRequest(err: any, user: any) {
    return user;
  }
}
