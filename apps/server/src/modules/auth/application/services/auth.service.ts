import { SignInDto } from '../../domain/dtos/sign-in.dto';
import { SignUpDto } from '../../domain/dtos/sign-up.dto';
import { IAuthService } from '../../domain/services/auth.service';

export class AuthService implements IAuthService {
  updateUserPassword: () => void;

  signIn: (dto: SignInDto) => void;

  signUp: (dto: SignUpDto) => void;

  resetPassword: (userId: string) => void;

  refreshTokens: (userId: string) => void;

  signInWithCode: () => void;

  signInWithCodeResend: () => void;

  signInWithCodeConsume: () => void;
}
