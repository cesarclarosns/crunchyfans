import { ResetPasswordEvent } from './reset-password.event';
import { SignUpEvent } from './sign-up.event';

export const AUTH_EVENTS = {
  ResetPassword: 'Auth.ResetPassword',
  SignUp: 'Auth.SignUp',
};

export { ResetPasswordEvent, SignUpEvent };
