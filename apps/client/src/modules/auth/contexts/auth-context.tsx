'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useCookies } from 'react-cookie';

import { Loader } from '@/common/components/loader';
import { AUTH_COOKIES } from '@/common/constants/cookies';
import { refresh } from '@/modules/auth/libs/refresh';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [, startTransition] = useTransition();

  const [isLoading, setIsLoading] = useState(true);
  const [cookies] = useCookies([AUTH_COOKIES.isUserAuthenticated]);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const protectedPaths: string[] = ['/my'];
    const pathnameIsProtected =
      protectedPaths.findIndex((path) => pathname.startsWith(path)) !== -1;

    if (!cookies[AUTH_COOKIES.isUserAuthenticated] && pathnameIsProtected) {
      startTransition(() => {
        router.push('/');
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [cookies[AUTH_COOKIES.isUserAuthenticated], pathname]);

  if (isLoading) return null;
  return children;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider(props: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);

  const [cookies] = useCookies([AUTH_COOKIES.isUserAuthenticated]);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (cookies[AUTH_COOKIES.isUserAuthenticated]) {
      refreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) return <Loader />;
  return <AuthGuard>{props.children}</AuthGuard>;
}
