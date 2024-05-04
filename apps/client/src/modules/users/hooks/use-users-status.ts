import { useEffect, useState } from 'react';

import { socket } from '@/modules/socket/libs/socket';

export function useUsersStatus(ids: string[]) {
  const [usersStatus, setUsersStatus] = useState<{
    offline: string[];
    online: string[];
  }>({
    offline: [],
    online: [],
  });

  useEffect(() => {
    const handleGetStatus = () => {
      socket.emit('users/get-status', { users: [...ids] }, (response) => {
        if (response.status === 'success') {
          setUsersStatus(response.payload);
        } else {
          setUsersStatus({ offline: [], online: [] });
        }
      });
    };

    handleGetStatus();
    const interval = setInterval(() => {
      handleGetStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { usersStatus };
}
