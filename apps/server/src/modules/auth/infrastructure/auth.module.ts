import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import {
  AccessTokenGuard,
  GoogleGuard,
  RefreshTokenGuard,
} from '@/modules/auth/application/guards';
import { AuthService } from '@/modules/auth/application/services/auth.service';
import { PasswordService } from '@/modules/auth/application/services/password.service';
import { TokensService } from '@/modules/auth/application/services/tokens.service';
import {
  AccessTokenStrategy,
  GoogleStrategy,
  RefreshTokenStrategy,
} from '@/modules/auth/application/strategies';
import { AuthController } from '@/modules/auth/presentation/controllers/auth.controller';
import { MediaModule } from '@/modules/media/infrastructure/media.module';
import { UsersModule } from '@/modules/users/infrastructure/users.module';

@Module({
  controllers: [AuthController],
  exports: [PasswordService, TokensService, AuthService],
  imports: [JwtModule.register({}), UsersModule, MediaModule],
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
