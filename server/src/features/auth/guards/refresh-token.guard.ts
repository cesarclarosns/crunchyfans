import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AUTH_STRATEGIES } from '../auth.constants';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(
  AUTH_STRATEGIES.refreshToken,
) {}
