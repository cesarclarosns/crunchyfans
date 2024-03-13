import { useMemo } from 'react';

import { type Message } from '@/schemas/chats/message';

import { useGetCurrentUserQuery } from '../users/use-get-current-user-query';

export function useIsMessageSeen(message: Message): boolean {
  const { data: user } = useGetCurrentUserQuery();

  const isSeen = useMemo<boolean>(() => {
    if (!user) return false;
    return message.seenBy.filter((id) => id !== user._id).length > 0;
  }, [message, user]);

  return isSeen;
}
