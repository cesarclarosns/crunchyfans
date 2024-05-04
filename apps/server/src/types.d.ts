import { TokenPayload } from '@/modules/auth/domain/types/token-payload';

declare module 'express-serve-static-core' {
  interface Request {
    user: TokenPayload;
  }
}

export {};
