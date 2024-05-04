import { useEffect } from 'react';

import { useGetUnreadChatsQuery } from '@/modules/chats/hooks/use-get-unread-chats';
import { useHandleMessageRead } from '@/modules/chats/hooks/use-handle-message-read';
import { useHandleNewMessage } from '@/modules/chats/hooks/use-handle-new-message';
import { useChatsStore } from '@/modules/chats/stores/chats-store';

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
