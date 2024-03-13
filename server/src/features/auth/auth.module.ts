import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '@/features/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AccessTokenGuard,
  GoogleOAuthGuard,
  RefreshTokenGuard,
} from './guards';
import {
  AccessTokenStrategy,
  GoogleOAuthStrategy,
  RefreshTokenStrategy,
} from './strategies';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [JwtModule.register({}), UsersModule],
  providers: [
    AuthService,
    AccessTokenStrategy,
    AccessTokenGuard,
    RefreshTokenStrategy,
    RefreshTokenGuard,
    GoogleOAuthStrategy,
    GoogleOAuthGuard,
  ],
})
export class AuthModule {}
