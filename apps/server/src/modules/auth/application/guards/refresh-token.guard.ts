import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthStrategies } from '../../domain/enums/auth-strategies';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(AuthStrategies.refreshToken) {}
