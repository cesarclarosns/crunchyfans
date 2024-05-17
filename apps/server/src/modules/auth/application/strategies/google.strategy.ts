import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { validateOrReject } from 'class-validator';
import { randomBytes } from 'crypto';
import mongoose from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { settings } from '@/config/settings';
import { MediaService } from '@/modules/media/application/services/media.service';
import { StorageService } from '@/modules/media/application/services/storage.service';
import { UsersService } from '@/modules/users/application/services/users.service';
import { CreateUserDto } from '@/modules/users/domain/dtos/create-user.dto';

import { AUTH_STRATEGIES } from '../../domain/constants/auth-strategies';
import { AuthService } from '../services/auth.service';

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
  ) {
    super({
      callbackURL: settings.AUTH.GOOGLE_CALLBACK_URL,
      clientID: settings.AUTH.GOOGLE_CLIENT_ID,
      clientSecret: settings.AUTH.GOOGLE_CLIENT_SECRET,
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
      const user = await this.usersService.getUserByGoogleId(googleId);

      if (user) {
      } else {
        const media = await this.c;

        const newUser = await this.usersService.createUser(
          new CreateUserDto({ email, name, oauth: { googleId } }),
        );
      }
    } catch (error) {
      this.logger.error('validate', error);

      done(error);
    }

    // try {
    //   let user = await this.usersService.findOneUserByGoogleId(googleId);

    //   if (!user) {
    //     const id = new mongoose.Types.ObjectId().toString();
    //     const username = `u${id}`;

    //     const createUserDto = new CreateUserDto({
    //       _id: id,
    //       email,
    //       name,
    //       oauth: { googleId },
    //       username,
    //     });

    //     await validateOrReject(createUserDto);

    //     user = await this.usersService.createUser(createUserDto);
    //   }

    //   const tokenPayload = this.authService.createTokenPayload(user);

    //   done(null, tokenPayload);
    // } catch (err) {
    //   done(err);
    // }
  }
}
