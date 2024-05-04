'use client';

import { useAuthStore } from '@/modules/auth/stores/auth-store';

import { SocketProvider } from '../../modules/socket/providers/socket-provider';
import { ChatsProvider } from './chats/chats-provider';
import { NotificationsProvider } from './notifications/notifications-provider';

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
