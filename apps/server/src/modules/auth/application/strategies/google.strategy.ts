import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { uid } from 'uid';

import { authSettings } from '@/config';
import { TokensService } from '@/modules/auth/application/services/tokens.service';
import { AuthStrategies } from '@/modules/auth/domain/enums/auth-strategies';
import { MediaService } from '@/modules/media/application/services/media.service';
import { StorageService } from '@/modules/media/application/services/storage.service';
import { UsersService } from '@/modules/users/application/services/users.service';
import { CreateUserWithAccountDto } from '@/modules/users/domain/dtos/create-user-with-account';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  AuthStrategies.google,
) {
  constructor(
    @InjectPinoLogger(GoogleStrategy.name) private readonly _logger: PinoLogger,
    private readonly _usersService: UsersService,
    private readonly _mediaService: MediaService,
    private readonly _storageService: StorageService,
    private readonly _tokensService: TokensService,
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
    const photoUrl =
      'https://lh3.googleusercontent.com/a/ACg8ocKezoW2COX53CED38nuQW5v6L1d1b3_OpldmmEZT46nwPyZ5-RA=s96-c';

    try {
      let user = await this._usersService.getUserByGoogleId(googleId);

      if (!user) {
        const username = uid(10);

        // Upload profile picture

        user = await this._usersService.createUserWithAccount(
          new CreateUserWithAccountDto({
            email,
            name,
            provider: 'google',
            providerAccountId: googleId,
            username,
          }),
        );
      }

      const payload = this._tokensService.createTokenPayload(user);

      done(null, payload);
    } catch (error) {
      done(error);
    }
  }
}
