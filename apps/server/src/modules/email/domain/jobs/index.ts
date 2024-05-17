export * from './send-email-sign-in-with-link.job';
export * from './send-email-successfull-sign-in.job';
export * from './send-email-welcome.job';

export const EMAIL_JOBS = {
  sendEmailSignInWithLink: 'email.sendEmailSignInWithLink',
  sendEmailSuccessfullSignIn: 'email.sendEmailSuccessfullSignIn',
  sendEmailWelcome: 'email.sendEmailWelcome',
} as const;
