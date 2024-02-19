'use client';

import { useAuthStore } from '@/stores/auth-store';

import { AuthForms } from './auth/auth-forms';
import { AuthFormsProvider } from './auth/auth-forms-provider';
import { NavBar } from './navbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore((state) => state);

  return (
    <div className="flex h-screen flex-col">
      {!isAuthenticated && (
        <div
          className="flex min-h-fit flex-1 flex-col items-center py-20"
          style={{ scrollbarWidth: 'none' }}
        >
          <AuthFormsProvider>
            <AuthForms />
          </AuthFormsProvider>
        </div>
      )}

      {isAuthenticated && (
        <div className="flex h-screen flex-col">
          <div className="flex h-screen flex-col-reverse lg:container sm:flex-row">
            <NavBar />
            <div className="flex flex-1 flex-col">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}
