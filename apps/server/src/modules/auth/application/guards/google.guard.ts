import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { appSettings } from '@/config';
import { AUTH_STRATEGIES } from '@/modules/auth/domain/constants/auth-strategies';

@Injectable()
export class GoogleGuard extends AuthGuard(AUTH_STRATEGIES.google) {
  constructor() {
    super({
      accessType: 'offline',
      failureRedirect: appSettings.APP_DOMAIN,
      prompt: 'select_account',
    });
  }
}
