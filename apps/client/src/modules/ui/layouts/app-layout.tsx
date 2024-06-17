'use client';

import { useAuthStore } from '@/modules/auth/stores/auth-store';

import { NavBar } from '../../../components/navbar';
import { AuthForms } from '../../auth/components/auth-forms';
import { AuthFormsProvider } from '../../auth/components/auth-forms-provider';

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
