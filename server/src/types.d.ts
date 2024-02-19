import { TokenPayload } from '@/features/auth/auth.types';

declare module 'express-serve-static-core' {
  interface Request {
    user: TokenPayload;
  }
}

export {};
