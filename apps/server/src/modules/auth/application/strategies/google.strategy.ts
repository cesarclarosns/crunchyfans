import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { authSettings } from '@/config';
import { AuthService } from '@/modules/auth/application/services/auth.service';
import { TokensService } from '@/modules/auth/application/services/tokens.service';
import { AUTH_STRATEGIES } from '@/modules/auth/domain/constants/auth-strategies';
import { MediaService } from '@/modules/media/application/services/media.service';
import { StorageService } from '@/modules/media/application/services/storage.service';
import { UsersService } from '@/modules/users/application/services/users.service';
import { CreateUserDto } from '@/modules/users/domain/dtos/create-user.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.google,
) {
  constructor(
    @InjectPinoLogger(GoogleStrategy.name) private readonly logger: PinoLogger,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mediaService: MediaService,
    private readonly storageService: StorageService,
    private readonly tokensService: TokensService,
  ) {
    super({
      callbackURL: authSettings.GOOGLE_CALLBACK_URL,
      clientID: authSettings.GOOGLE_CLIENT_ID,
      clientSecret: authSettings.GOOGLE_CLIENT_SECRET,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const email = profile.emails![0].value;
    const name = profile.displayName;
    const googleId = profile.id;
    const photo = profile.photos![0].value;

    this.logger.trace('profile', { email, googleId, name, photo });

    try {
      let user = await this.usersService.getUserByGoogleId(googleId);

      if (!user) {
        // Create media

        user = await this.usersService.createUser(
          new CreateUserDto({
            email,
            id: '',
            name,
            oauth: { googleId },
            pictures: { profile: photo },
          }),
        );
      }

      const payload = this.tokensService.createTokenPayload(user);

      done(null, payload);
    } catch (error) {
      this.logger.error('validate', error);

      done(error);
    }
  }
}
