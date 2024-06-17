export * from './user-requested-link-to-sign-in.event';
export * from './user-signed-in.event';

export enum AuthDomainEvents {
  userRequestedLinkToSignIn = 'auth.userRequestedLinkToSignIn',
  userSignedIn = 'auth.userSignedIn',
}
