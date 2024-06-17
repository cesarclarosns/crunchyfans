import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { appSettings } from '@/config';
import { AuthStrategies } from '@/modules/auth/domain/enums/auth-strategies';

@Injectable()
export class GoogleGuard extends AuthGuard(AuthStrategies.google) {
  constructor() {
    super({
      accessType: 'offline',
      failureRedirect: appSettings.APP_DOMAIN,
      prompt: 'select_account',
    });
  }
}
