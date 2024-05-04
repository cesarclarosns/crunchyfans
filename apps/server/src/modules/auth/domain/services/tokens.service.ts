export interface ITokensService {
  refreshTokens: (userId: string) => Promise<void>;

  getAccessToken: (payload: object) => Promise<string>;

  getRefreshToken: (payload: object) => Promise<string>;

  getCodeToken: (payload: object) => Promise<string>;

  verifyCodeToken: (token: string) => Promise<object>;
}

export const ITokensService = Symbol('ITokensService');
