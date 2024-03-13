'use client';

import { useEffect } from 'react';

import { refresh } from '@/hooks/auth/refresh';
import { socket } from '@/libs/socket';
import { useAuthStore } from '@/stores/auth-store';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { auth, isAuthenticated } = useAuthStore((state) => state);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!window.WebSocket) return;

    socket.io.opts.query = { accessToken: auth?.accessToken };
    socket.io.opts.autoConnect = true;
    socket.connect();

    const handleOnConnect = () => {
      console.log('socket connect', socket.id);
    };
    const handleOnConnectError = (error: Error) => {
      console.log('socket connect_error', error.message);

      if (error.message.includes('expired')) {
        refresh().then(({ accessToken }) => {
          socket.io.opts.query = { accessToken };
          socket.close();
          socket.connect();
        });
      }
    };
    const handleDisconnect = () => {
      console.log('socket disconnect');
    };

    socket.on('connect', handleOnConnect);
    socket.on('connect_error', handleOnConnectError);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.disconnect();

      socket.off('connect', handleOnConnect);
      socket.off('connect_error', handleOnConnectError);
      socket.off('disconnect', handleDisconnect);
    };
  }, [isAuthenticated]);

  return <>{children}</>;
}
