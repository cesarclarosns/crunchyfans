import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { URL } from 'url';

import { settings } from '@/config/settings';
import { UsersService } from '@/modules/users/application/services/users.service';
import { CreateUserDto } from '@/modules/users/domain/dtos/create-user.dto';
import { UpdateUserDto } from '@/modules/users/domain/dtos/update-user.dto';
import { User } from '@/modules/users/domain/models/user.model';

import { SignInDto } from '../../domain/dtos/sign-in.dto';
import { SignInWithLinkDto } from '../../domain/dtos/sign-in-with-link.dto';
import { SignInWithLinkConsumeDto } from '../../domain/dtos/sign-in-with-link-consume.dto';
import { SignUpDto } from '../../domain/dtos/sign-up.dto';
import { UpdatePasswordDto } from '../../domain/dtos/update-password.dto';
import {
  AUTH_EVENTS,
  UserRequestedLinkToSignInEvent,
} from '../../domain/events';
import { Tokens } from '../../domain/models/tokens';
import { TokenPayload } from '../../domain/types/token-payload';
import { PasswordService } from './password.service';
import { TokensService } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokensService: TokensService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<Tokens> {
    const user = await this.usersService.getUserByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Email is not registered');
    }

    const isPasswordValid = await this.passwordService.verifyPassword(
      user.hashedPassword,
      signInDto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect.');
    }

    const tokens = await this.tokensService.refreshTokens(user.id);
    return tokens;
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const [userByEmail, userByUsername] = await Promise.all([
      this.usersService.getUserByEmail(signUpDto.email),
      this.usersService.getUserByUsername(signUpDto.username),
    ]);

    if (userByEmail || userByUsername) {
      throw new BadRequestException('Email or username is already taken.');
    }

    const newUser = await this.usersService.createUser(
      new CreateUserDto({ ...signUpDto }),
    );

    return newUser;
  }

  async signInWithLink(dto: SignInWithLinkDto) {
    const user = await this.usersService.getUserById(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email is not registered');
    }

    const token = await this.tokensService.createLinkToken({
      sub: user.id,
    } satisfies TokenPayload);

    const url = new URL('/', settings.APP.DOMAIN);
    url.searchParams.set('token', token);

    this.eventEmitter.emit(
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
    const payload = (await this.tokensService.verifyLinkToken(
      dto.token,
    )) as TokenPayload;

    return await this.tokensService.refreshTokens(payload.sub);
  }

  async updateUserPassword(userId: string, dto: UpdatePasswordDto) {
    const newHashedPassword = await this.passwordService.createPasswordHash(
      dto.password,
    );

    return await this.usersService.updateUser(
      userId,
      new UpdateUserDto({ hashedPassword: newHashedPassword }),
    );
  }
}
