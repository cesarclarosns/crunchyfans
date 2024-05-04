'use client';

import { useAuthFormsContext } from './auth-forms-provider';
import { ResetPasswordForm } from './reset-password-form';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';

export function AuthForms() {
  const { currentForm } = useAuthFormsContext();

  if (currentForm === 'signIn') return <SignInForm />;
  if (currentForm === 'signUp') return <SignUpForm />;
  if (currentForm === 'resetPassword') return <ResetPasswordForm />;
}

AuthForms.Provider = {};
