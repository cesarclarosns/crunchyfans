'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useCookies } from 'react-cookie';

import { AUTH_COOKIES } from '@/common/constants/cookies';
import { refresh } from '@/hooks/auth';
import { useAuthStore } from '@/stores/auth-store';

import { Loader } from '../loader';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [, startTransition] = useTransition();

  const { isAuthenticated } = useAuthStore((state) => state);

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const protectedPaths: string[] = ['/my/', '/app/'];
    const pathnameIsProtected =
      protectedPaths.findIndex((path) => pathname.includes(path)) !== -1;

    if (!isAuthenticated && pathnameIsProtected) {
      startTransition(() => {
        router.push('/');
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, pathname]);

  if (isLoading) return null;
  return children;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setIsAuthenticated } = useAuthStore(
    (state) => state,
  );

  const [isLoading, setIsLoading] = useState(true);

  const [cookies] = useCookies([AUTH_COOKIES.isAuthenticated]);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        await refresh();
        setIsAuthenticated(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthenticated && cookies[AUTH_COOKIES.isAuthenticated]) {
      refreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) return <Loader />;
  return <AuthGuard>{children}</AuthGuard>;
}
