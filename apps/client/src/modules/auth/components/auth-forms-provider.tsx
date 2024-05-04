'use client';

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from 'react';

type CurrentForm = 'signIn' | 'signUp' | 'resetPassword';

const AuthFormsContext = createContext<{
  currentForm: CurrentForm;
  setCurrentForm: Dispatch<SetStateAction<CurrentForm>>;
} | null>(null);

type AuthFormsProviderProps = {
  children: React.ReactNode;
};

export function AuthFormsProvider({ children }: AuthFormsProviderProps) {
  const [currentForm, setCurrentForm] = useState<CurrentForm>('signIn');

  return (
    <AuthFormsContext.Provider value={{ currentForm, setCurrentForm }}>
      {children}
    </AuthFormsContext.Provider>
  );
}

export function useAuthFormsContext() {
  const context = useContext(AuthFormsContext);

  if (!context)
    throw new Error(
      'useAuthFormsContext must be used with an AuthFormsProvider',
    );

  return context;
}
