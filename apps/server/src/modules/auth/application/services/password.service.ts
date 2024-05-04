import { IPasswordService } from '../../domain/services/password.service';

export class PasswordService implements IPasswordService {
  createPasswordHash: (password: string) => Promise<string>;

  verifyPassword: (
    password: string,
    hashedPassword: string,
  ) => Promise<boolean>;
}
