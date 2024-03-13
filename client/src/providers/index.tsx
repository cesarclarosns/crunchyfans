'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CookiesProvider } from 'react-cookie';

import { AppProvider } from './app/app-provider';
import { ChatsProvider } from './app/chats/chats-provider';
import { PaymentsProvider } from './app/payments/elements-provider';
import { AuthProvider } from './auth/auth-provider';
import { SocketProvider } from './app/socket/socket-provider';
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
            <AppProvider>{children}</AppProvider>
          </AuthProvider>
        </CookiesProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
