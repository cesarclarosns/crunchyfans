import { useMemo } from 'react';

import { type Message } from '@/schemas/chats/message';

import { useGetCurrentUserQuery } from '../users/use-get-current-user-query';

export function useIsMessageRead(message: Message): boolean {
  const { data: user } = useGetCurrentUserQuery();

  const isRead = useMemo(() => {
    if (!user) return false;
    return message.userId === user._id || message.seenBy.includes(user._id);
  }, [user, message]);

  return isRead;
}
