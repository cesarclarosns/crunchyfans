import { ITokensService } from '../../domain/services/tokens.service';

export class TokensService implements ITokensService {
  async refreshTokens(userId: string) {}

  getAccessToken: (payload: object) => Promise<string>;

  getRefreshToken: (payload: object) => Promise<string>;

  getCodeToken: (payload: object) => Promise<string>;

  verifyCodeToken: (token: string) => Promise<object>;
}
