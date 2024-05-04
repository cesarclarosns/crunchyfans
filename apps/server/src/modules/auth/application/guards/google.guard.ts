import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { settings } from '@/config/settings';

import { AUTH_STRATEGIES } from '../../domain/constants/auth-strategies';

@Injectable()
export class GoogleGuard extends AuthGuard(AUTH_STRATEGIES.google) {
  constructor() {
    super({
      accessType: 'offline',
      failureRedirect: settings.APP.DOMAIN,
      prompt: 'select_account',
    });
  }
}
