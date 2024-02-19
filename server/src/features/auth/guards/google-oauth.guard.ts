import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { config } from '@/config';

import { AUTH_STRATEGIES } from '../auth.constants';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard(AUTH_STRATEGIES.googleOAuth) {
  constructor() {
    super({
      accessType: 'offline',
      failureRedirect: config.APP.APP_DOMAIN,
      prompt: 'select_account',
    });
  }
}
