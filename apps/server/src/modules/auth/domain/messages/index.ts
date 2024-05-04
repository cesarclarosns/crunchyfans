export * from './sign-up.event';

export const AUTH_EVENTS = {
  signIn: 'auth.signIn',
  signUp: 'auth.signUp',
} as const;

class SignedIn {}
class SignedUp {}
class PostCreated {}
