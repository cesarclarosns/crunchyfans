export * from './user-requested-link-to-sign-in.event';
export * from './user-signed-in.event';

export const AUTH_EVENTS = {
  userRequestedLinkToSignIn: 'auth.userRequestedLinkToSignIn',
  userSignedIn: 'auth.userSignedIn',
} as const;
