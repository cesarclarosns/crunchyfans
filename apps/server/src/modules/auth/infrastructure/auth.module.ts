import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '@/modules/users/infrastructure/users.module';

import {
  AccessTokenGuard,
  GoogleGuard,
  RefreshTokenGuard,
} from '../application/guards';
import { AuthService } from '../application/services/auth.service';
import { PasswordService } from '../application/services/password.service';
import { TokensService } from '../application/services/tokens.service';
import {
  AccessTokenStrategy,
  GoogleStrategy,
  RefreshTokenStrategy,
} from '../application/strategies';
import { AuthController } from '../presentation/controllers/auth.controller';

@Module({
  controllers: [AuthController],
  exports: [PasswordService, TokensService, AuthService],
  imports: [JwtModule.register({}), UsersModule],
  providers: [
    PasswordService,
    TokensService,
    AuthService,
    AccessTokenStrategy,
    AccessTokenGuard,
    RefreshTokenStrategy,
    RefreshTokenGuard,
    GoogleGuard,
    GoogleStrategy,
  ],
})
export class AuthModule {}
