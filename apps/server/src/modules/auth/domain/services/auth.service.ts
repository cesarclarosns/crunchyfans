import { SignInDto } from '../dtos/sign-in.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { UpdatePasswordDto } from '../dtos/update-password.dto';

export interface IAuthService {
  signIn: (signInDto: SignInDto) => void;

  signUp: (signUpDto: SignUpDto) => void;

  signInWithCode: () => void;

  signInWithCodeConsume: () => void;

  updateUserPassword: (updatePasswordDto: UpdatePasswordDto) => void;
}

export const IAuthService = Symbol('IAuthService');
