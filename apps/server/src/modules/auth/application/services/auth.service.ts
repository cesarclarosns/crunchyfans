import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { URL } from 'url';

import { settings } from '@/config/settings';
import { PasswordService } from '@/modules/auth/application/services/password.service';
import { TokensService } from '@/modules/auth/application/services/tokens.service';
import { SignInDto } from '@/modules/auth/domain/dtos/sign-in.dto';
import { SignInWithLinkDto } from '@/modules/auth/domain/dtos/sign-in-with-link.dto';
import { SignInWithLinkConsumeDto } from '@/modules/auth/domain/dtos/sign-in-with-link-consume.dto';
import { SignUpDto } from '@/modules/auth/domain/dtos/sign-up.dto';
import { UpdatePasswordDto } from '@/modules/auth/domain/dtos/update-password.dto';
import {
  AUTH_EVENTS,
  UserRequestedLinkToSignInEvent,
} from '@/modules/auth/domain/events';
import { Tokens } from '@/modules/auth/domain/models/tokens';
import { TokenPayload } from '@/modules/auth/domain/types/token-payload';
import { UsersService } from '@/modules/users/application/services/users.service';
import { CreateUserDto } from '@/modules/users/domain/dtos/create-user.dto';
import { UpdateUserDto } from '@/modules/users/domain/dtos/update-user.dto';
import { User } from '@/modules/users/domain/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly _eventEmitter: EventEmitter2,
    private readonly _usersService: UsersService,
    private readonly _passwordService: PasswordService,
    private readonly _tokensService: TokensService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<Tokens> {
    const user = await this._usersService.getUserByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Email is not registered');
    }

    const isPasswordValid = await this._passwordService.verifyPassword(
      user.hashedPassword,
      signInDto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect.');
    }

    const tokens = await this._tokensService.refreshTokens(user.id);
    return tokens;
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const [userByEmail, userByUsername] = await Promise.all([
      this._usersService.getUserByEmail(signUpDto.email),
      this._usersService.getUserByUsername(signUpDto.username),
    ]);

    if (userByEmail || userByUsername) {
      throw new BadRequestException('Email or username is already taken.');
    }

    const newUser = await this._usersService.createUser(
      new CreateUserDto({ ...signUpDto }),
    );

    return newUser;
  }

  async signInWithLink(dto: SignInWithLinkDto) {
    const user = await this._usersService.getUserById(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email is not registered');
    }

    const token = await this._tokensService.createLinkToken({
      sub: user.id,
    } satisfies TokenPayload);

    const url = new URL('/', settings.APP.DOMAIN);
    url.searchParams.set('token', token);

    this._eventEmitter.emit(
      AUTH_EVENTS.userRequestedLinkToSignIn,
      new UserRequestedLinkToSignInEvent({
        email: dto.email,
        ip: dto.ip,
        link: url.toString(),
        timestamp: new Date().toISOString(),
        userAgent: dto.userAgent,
      }),
    );
  }

  async signInWithLinkConsume(dto: SignInWithLinkConsumeDto) {
    const payload = (await this._tokensService.verifyLinkToken(
      dto.token,
    )) as TokenPayload;

    return await this._tokensService.refreshTokens(payload.sub);
  }

  async updateUserPassword(userId: string, dto: UpdatePasswordDto) {
    const newHashedPassword = await this._passwordService.createPasswordHash(
      dto.password,
    );

    return await this._usersService.updateUser(
      userId,
      new UpdateUserDto({ hashedPassword: newHashedPassword }),
    );
  }
}
