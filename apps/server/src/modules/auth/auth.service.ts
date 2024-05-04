import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';

import { settings } from '@/config/settings';
import { UsersService } from '@/modules/users/application/services/users.service';
import { UserDto } from '@/modules/users/domain/dtos/user.dto';

import { IUsersService } from '../users/domain/services/users.service';
import { SignInDto } from './domain/dtos/sign-in.dto';
import { SignUpDto } from './domain/dtos/sign-up.dto';
import { TokensDto } from './domain/dtos/tokens.dto';
import { UpdatePasswordDto } from './domain/dtos/update-password.dto';
import { AUTH_EVENTS, SignUpEvent } from './domain/messages';
import { IAuthService } from './domain/services/auth.service';
import { TokenPayload } from './domain/types/token-payload';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
    @Inject(IUsersService) private readonly usersService: IUsersService,
  ) {}

  signInWithCode: () => void;
  signInWithCodeResend: () => void;
  signInWithCodeConsume: () => void;
  updateUserPassword: () => void;

  async signIn(signInDto: SignInDto): Promise<TokensDto> {
    const user = await this.usersService.getUserByEmail(signInDto.email);
    if (!user) {
      throw new NotFoundException();
    }

    if (!user.hashedPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const passwordMatches = await argon2.verify(
      user.hashedPassword,
      signInDto.password,
    );
    if (!passwordMatches) {
      throw new BadRequestException('Invalid credentials');
    }

    return await this.refreshTokens(user.id);
  }

  async signUp(signUpDto: SignUpDto): Promise<UserDto> {
    const [userByEmail, userByUsername] = await Promise.all([
      this.usersService.getUserByEmail(signUpDto.email),
      this.usersService.getUserByUsername(signUpDto.username),
    ]);

    if (userByEmail || userByUsername) {
      throw new BadRequestException(
        'The email or username is already registered',
      );
    }

    const hashedPassword = await this.createPasswordHash(signUpDto.password);

    const newUser = await this.usersService.createUser({
      email: signUpDto.email,
      hashedPassword,
      name: signUpDto.name,
      username: signUpDto.username,
    });

    // Emit events
    this.eventEmitter.emit(
      AUTH_EVENTS.signUp,
      new SignUpEvent({ userId: newUser.id }),
    );

    return newUser;
  }

  async refreshTokens(userId: string): Promise<TokensDto> {
    const user = await this.usersService.findOneUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.createTokens(user);
    return tokens;
  }

  async createTokens(user: UserDto): Promise<TokensDto> {
    const tokenPayload = this.createTokenPayload(user);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(tokenPayload, {
        expiresIn: settings.AUTH.JWT_ACCESS_EXPIRE_MINUTES * 60,
        secret: settings.AUTH.JWT_ACCESS_SECRET,
      }),
      this.jwtService.signAsync(tokenPayload, {
        expiresIn: settings.AUTH.JWT_REFRESH_EXPIRE_MINUTES * 60,
        secret: settings.AUTH.JWT_REFRESH_SECRET,
      }),
    ]);

    const tokens = new TokensDto({ accessToken, refreshToken });
    return tokens;
  }

  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserDto | null> {
    const hashedPassword = await this.createPasswordHash(
      updatePasswordDto.password,
    );

    const user = await this.usersService.updateUser(userId, {
      hashedPassword,
    });

    return user;
  }

  createTokenPayload(user: UserDto): TokenPayload {
    return { sub: user.id };
  }

  async createPasswordHash(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async createPasswordlessToken(user: UserDto): Promise<string> {
    const tokenPayload = this.createTokenPayload(user);

    const token = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: settings.AUTH.JWT_REFRESH_EXPIRE_MINUTES * 60,
      secret: settings.AUTH.JWT_PASSWORDLESS_SECRET,
    });

    return token;
  }

  async verifyPasswordlessToken(token: string): Promise<TokenPayload> {
    const tokenPayload = await this.jwtService.verifyAsync<TokenPayload>(
      token,
      {
        secret: settings.AUTH.JWT_PASSWORDLESS_SECRET,
      },
    );

    return tokenPayload;
  }
}
