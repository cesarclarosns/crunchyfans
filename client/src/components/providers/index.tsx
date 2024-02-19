'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CookiesProvider } from 'react-cookie';

import { AuthProvider } from './auth-provider';
import { ElementsProvider } from './elements-provider';
import { SocketProvider } from './socket-provider';
import { ThemeProvider } from './theme-provider';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
          <AuthProvider>
            <SocketProvider>
              <ElementsProvider>{children}</ElementsProvider>
            </SocketProvider>
          </AuthProvider>
        </CookiesProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
