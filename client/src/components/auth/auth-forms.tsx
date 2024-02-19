'use client';

import { useAuthFormsContext } from './auth-forms-provider';
import { ResetPasswordForm } from './forms/reset-password-form';
import { SignInForm } from './forms/sign-in-form';
import { SignUpForm } from './forms/sign-up-form';

export function AuthForms() {
  const { currentForm } = useAuthFormsContext();

  if (currentForm === 'signIn') return <SignInForm />;
  if (currentForm === 'signUp') return <SignUpForm />;
  if (currentForm === 'resetPassword') return <ResetPasswordForm />;
}
