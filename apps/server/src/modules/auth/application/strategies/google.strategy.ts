import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { validateOrReject } from 'class-validator';
import { randomBytes } from 'crypto';
import mongoose from 'mongoose';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { settings } from '@/config/settings';
import { UsersService } from '@/modules/users/application/services/users.service';
import { CreateUserDto } from '@/modules/users/domain/dtos/create-user.dto';

import { AuthService } from '../../auth.service';
import { AUTH_STRATEGIES } from '../../domain/constants/auth-strategies';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.google,
) {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
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
    const email = profile.emails?.[0].value;
    const name = profile.displayName;
    const googleId = profile.id;

    try {
      let user = await this.usersService.findOneUserByGoogleId(googleId);

      if (!user) {
        const id = new mongoose.Types.ObjectId().toString();
        const username = `u${id}`;

        const createUserDto = new CreateUserDto({
          _id: id,
          email,
          name,
          oauth: { googleId },
          username,
        });

        await validateOrReject(createUserDto);

        user = await this.usersService.createUser(createUserDto);
      }

      const tokenPayload = this.authService.createTokenPayload(user);

      done(null, tokenPayload);
    } catch (err) {
      done(err);
    }
  }
}
