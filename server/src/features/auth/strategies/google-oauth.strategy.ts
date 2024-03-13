import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { validateOrReject } from 'class-validator';
import mongoose from 'mongoose';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { config } from '@/config';
import { CreateUserDto } from '@/features/users/dto/create-user.dto';
import { UsersService } from '@/features/users/users.service';

import { AUTH_STRATEGIES } from '../auth.constants';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.googleOAuth,
) {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super({
      callbackURL: config.AUTH.GOOGLE_CALLBACK_URL,
      clientID: config.AUTH.GOOGLE_CLIENT_ID,
      clientSecret: config.AUTH.GOOGLE_CLIENT_SECRET,
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
    const displayName = profile.displayName;
    const googleId = profile.id;

    try {
      let user = await this.usersService.findOne({
        email,
        googleId,
      });

      if (!user) {
        const createUserDto = new CreateUserDto();
        createUserDto._id = new mongoose.Types.ObjectId().toString();
        createUserDto.username = `u${createUserDto._id}`;
        createUserDto.displayName = displayName;
        createUserDto.oauth = { googleId };
        if (email) createUserDto.email = email;

        await validateOrReject(createUserDto);

        user = await this.usersService.create(createUserDto);
      }

      const payload = this.authService.getTokenPayload(
        (user._id as unknown as mongoose.Types.ObjectId).toString(),
      );

      done(null, payload);
    } catch (err) {
      done(err);
    }
  }
}
