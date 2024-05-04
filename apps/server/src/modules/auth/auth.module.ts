import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '@/modules/users/users.module';

import {
  AccessTokenGuard,
  GoogleOAuthGuard,
  RefreshTokenGuard,
} from './application/guards';
import { PasswordService } from './application/services/password.service';
import {
  AccessTokenStrategy,
  GoogleOAuthStrategy,
  RefreshTokenStrategy,
} from './application/strategies';
import { AuthService } from './auth.service';
import { IAuthService } from './domain/services/auth.service';
import { IPasswordService } from './domain/services/password.service';
import { ITokensService } from './domain/services/tokens.service';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  controllers: [AuthController],
  exports: [{ provide: IAuthService, useClass: AuthService }],
  imports: [JwtModule.register({}), UsersModule],
  providers: [
    {
      provide: IAuthService,
      useClass: AuthService,
    },
    {
      provide: IPasswordService,
      useClass: PasswordService,
    },
    {
      provide: ITokensService,
      useClass: PasswordService,
    },
    AccessTokenStrategy,
    AccessTokenGuard,
    RefreshTokenStrategy,
    RefreshTokenGuard,
    GoogleOAuthStrategy,
    GoogleOAuthGuard,
  ],
})
export class AuthModule {}
