import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { settings } from '@/config/settings';
import { Tokens } from '@/modules/auth/domain/models/tokens';
import { TokenPayload } from '@/modules/auth/domain/types/token-payload';
import { UsersService } from '@/modules/users/application/services/users.service';
import { User } from '@/modules/users/domain/entities/user.model';

@Injectable()
export class TokensService {
  constructor(
    @InjectPinoLogger(TokensService.name) private readonly _logger: PinoLogger,
    private readonly _jwtService: JwtService,
    private readonly _usersService: UsersService,
  ) {}

  async createAccessToken(payload: TokenPayload): Promise<string> {
    return await this._jwtService.signAsync(payload, {
      expiresIn: settings.AUTH.JWT_ACCESS_EXPIRE_MINUTES * 60,
      secret: settings.AUTH.JWT_ACCESS_SECRET,
    });
  }

  async verifyAccessToken(token: string): Promise<object> {
    try {
      return await this._jwtService.verifyAsync(token, {
        secret: settings.AUTH.JWT_ACCESS_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async createRefreshToken(payload: TokenPayload): Promise<string> {
    return await this._jwtService.signAsync(payload, {
      expiresIn: settings.AUTH.JWT_REFRESH_EXPIRE_MINUTES * 60,
      secret: settings.AUTH.JWT_REFRESH_SECRET,
    });
  }

  async verifyRefreshToken(token: string): Promise<object> {
    try {
      return await this._jwtService.verifyAsync(token, {
        secret: settings.AUTH.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async createLinkToken(payload: TokenPayload): Promise<string> {
    return await this._jwtService.signAsync(payload, {
      expiresIn: settings.AUTH.JWT_LINK_EXPIRE_MINUTES * 60,
      secret: settings.AUTH.JWT_LINK_SECRET,
    });
  }

  async verifyLinkToken(token: string): Promise<object> {
    try {
      return await this._jwtService.verifyAsync(token, {
        secret: settings.AUTH.JWT_LINK_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async refreshTokens(userId: string): Promise<Tokens> {
    const user = await this._usersService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = this.createTokenPayload(user);

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(payload),
      this.createRefreshToken(payload),
    ]);

    return new Tokens({ accessToken, refreshToken });
  }

  createTokenPayload(user: User): TokenPayload {
    return { sub: user.id };
  }
}
