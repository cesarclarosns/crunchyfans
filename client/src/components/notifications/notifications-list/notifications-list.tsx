import { useEffect } from 'react';

import { socket } from '@/libs/socket';

export function NotificationsList() {
  useEffect(() => {
    if (!socket) return;

    const handleOnNewNotification = () => {};

    socket.on('notifications/new-notification', handleOnNewNotification);

    return () =>
      socket.off('notifications/new-notification', handleOnNewNotification);
  }, []);

  return <></>;
}
