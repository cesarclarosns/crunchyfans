import argon2 from 'argon2';

export interface IPasswordService {
  createPasswordHash(password: string): Promise<string>;

  verifyPassword(hashedPassword: string, password: string): Promise<boolean>;
}

export class PasswordService implements IPasswordService {
  async createPasswordHash(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async verifyPassword(
    hashedPassword: string,
    password: string,
  ): Promise<boolean> {
    return await argon2.verify(hashedPassword, password);
  }
}
