import { useEffect } from 'react';

import { useGetUnreadChatsQuery } from '@/hooks/chats/use-get-unread-chats-query';
import { useHandleMessageRead } from '@/hooks/chats/use-handle-message-read';
import { useHandleNewMessage } from '@/hooks/chats/use-handle-new-message';
import { useChatsStore } from '@/stores/chats-store';

interface ChatsProviderProps {
  children: React.ReactNode;
}

export function ChatsProvider({ children }: ChatsProviderProps) {
  const { setUnreadChats } = useChatsStore((state) => state);

  useHandleNewMessage();
  useHandleMessageRead();

  // const { data: unreadChats } = useGetUnreadChatsQuery();
  // useEffect(() => {
  //   if (unreadChats !== undefined) setUnreadChats(unreadChats.count);
  // }, [unreadChats]);

  return <>{children}</>;
}
