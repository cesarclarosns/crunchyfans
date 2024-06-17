import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthStrategies } from '../../domain/enums/auth-strategies';

@Injectable()
export class OptionalAccessTokenGuard extends AuthGuard(
  AuthStrategies.accessToken,
) {
  handleRequest(err: any, user: any) {
    return user;
  }
}
