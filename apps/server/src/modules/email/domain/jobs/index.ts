export * from './send-email-sign-in.job';
export * from './send-email-sign-up.job';

export const EMAIL_QUEUE = 'email';

export const EMAIL_JOBS = {
  sendEmailSignIn: 'sendEmailSignIn',
  sendEmailSignInWithCode: 'sendEmailSignInWithCode',
  sendEmailSignUp: 'sendEmailSignUp',
} as const;
