import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { URL } from 'url';

import { appSettings } from '@/config';
import {
  PasswordService,
  TokensService,
} from '@/modules/auth/application/services';
import {
  AuthDomainEvents,
  UserRequestedLinkToSignInEvent,
} from '@/modules/auth/domain/domain-events';
import { SignInDto } from '@/modules/auth/domain/dtos/sign-in.dto';
import { SignInWithLinkDto } from '@/modules/auth/domain/dtos/sign-in-with-link.dto';
import { SignInWithLinkConsumeDto } from '@/modules/auth/domain/dtos/sign-in-with-link-consume.dto';
import { SignUpDto } from '@/modules/auth/domain/dtos/sign-up.dto';
import { UpdatePasswordDto } from '@/modules/auth/domain/dtos/update-password.dto';
import { Tokens } from '@/modules/auth/domain/entities/tokens';
import { TokenPayload } from '@/modules/auth/domain/types/token-payload';
import { UsersService } from '@/modules/users/application/services/users.service';
import { CreateUserDto } from '@/modules/users/domain/dtos/create-user.dto';
import { UpdateUserDto } from '@/modules/users/domain/dtos/update-user.dto';
import { User } from '@/modules/users/domain/entities/user';

export interface IAuthService {
  signIn(dto: SignInDto): Promise<Tokens>;

  signUp(dto: SignUpDto): Promise<User>;

  signInWithLink(dto: SignInWithLinkDto): Promise<void>;

  signInWithLinkConsume(dto: SignInWithLinkConsumeDto): Promise<Tokens>;

  updateUserPassword(
    userId: string,
    update: UpdatePasswordDto,
  ): Promise<User | null>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectPinoLogger(AuthService.name) private readonly _logger: PinoLogger,
    private readonly _eventEmitter: EventEmitter2,
    private readonly _usersService: UsersService,
    private readonly _passwordService: PasswordService,
    private readonly _tokensService: TokensService,
  ) {}

  async signIn(dto: SignInDto): Promise<Tokens> {
    const user = await this._usersService.getUserByEmail(dto.email);
    this._logger.debug({ user });
    if (!user) {
      throw new BadRequestException('Email is not registered');
    }
    if (!user.hashedPassword) {
      throw new BadRequestException('Password is incorrect');
    }

    const isPasswordValid = await this._passwordService.verifyPassword(
      user.hashedPassword,
      dto.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Password is incorrect');
    }

    const tokens = await this._tokensService.refreshTokens(user.id);
    return tokens;
  }

  async signUp(dto: SignUpDto): Promise<User> {
    const [userByEmail, userByUsername] = await Promise.all([
      this._usersService.getUserByEmail(dto.email),
      this._usersService.getUserByUsername(dto.username),
    ]);

    if (userByEmail || userByUsername) {
      throw new BadRequestException('Email or username is already taken.');
    }

    const newUser = await this._usersService.createUser(
      new CreateUserDto({ ...dto }),
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

    const url = new URL('/', appSettings.APP_DOMAIN);
    url.searchParams.set('token', token);

    this._eventEmitter.emit(AuthDomainEvents.userRequestedLinkToSignIn, {
      email: dto.email,
      ip: dto.ip,
      link: url.toString(),
      timestamp: new Date().toISOString(),
      userAgent: dto.userAgent,
    } satisfies UserRequestedLinkToSignInEvent);
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
