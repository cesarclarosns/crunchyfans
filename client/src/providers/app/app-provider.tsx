'use client';

import { useAuthStore } from '@/stores/auth-store';

import { ChatsProvider } from './chats/chats-provider';
import { NotificationsProvider } from './notifications/notifications-provider';
import { SocketProvider } from './socket/socket-provider';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore((state) => state);

  if (isAuthenticated) {
    return (
      <SocketProvider>
        <ChatsProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </ChatsProvider>
      </SocketProvider>
    );
  }
  return children;
}
