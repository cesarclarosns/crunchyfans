'use client';

import { useAuthStore } from '@/modules/auth/stores/auth-store';
import { ChatsProvider } from '@/modules/chats/contexts/chats-context';
import { NotificationsProvider } from '@/modules/notifications/contexts/notifications-context';
import { SocketProvider } from '@/modules/socket/contexts/socket-context';

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
