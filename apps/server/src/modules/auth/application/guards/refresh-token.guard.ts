import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AUTH_STRATEGIES } from '../../domain/constants/auth-strategies';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(
  AUTH_STRATEGIES.refreshToken,
) {}
