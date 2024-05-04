export interface IPasswordService {
  createPasswordHash: (password: string) => Promise<string>;

  verifyPassword: (
    password: string,
    hashedPassword: string,
  ) => Promise<boolean>;
}

export const IPasswordService = Symbol('IPasswordService');
