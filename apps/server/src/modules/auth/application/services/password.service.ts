import argon2 from 'argon2';

export class PasswordService {
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
