import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { socket } from '@/modules/socket/libs/socket';
import {
  type EventPayload,
  type ServerToClientEvents,
} from '@/modules/socket/types/socket';

import { useGetCurrentUserQuery } from '../../users/hooks/use-get-current-user';
import { chatsKeys } from './chats-keys';
import { type InfiniteDataChats } from './use-get-chats';
import { type InfiniteDataMessages } from './use-get-messages';

export function useHandleNewMessage() {
  const queryClient = useQueryClient();

  const { data: currentUser } = useGetCurrentUserQuery();

  useEffect(() => {
    if (!currentUser) return;

    const handleNewMessage = (
      ev: EventPayload<ServerToClientEvents['chats/new-message']>,
    ) => {
      console.log('on chats/new-message', ev);

      if (ev.message.seenBy.includes(currentUser._id)) return;

      queryClient.setQueryData(
        chatsKeys.infiniteMessageList({
          chatId: ev.chat._id,
        }),
        (data: InfiniteDataMessages) => {
          if (data) {
            return {
              pageParams: [...data.pageParams],
              pages: [
                [ev.message, ...(data.pages.at(0) ?? [])],
                ...data.pages.slice(1),
              ],
            };
          }

          return data;
        },
      );

      queryClient.setQueriesData(
        { queryKey: chatsKeys.infiniteChats() },
        (data: InfiniteDataChats | undefined) => {
          if (data) {
            let pages = data.pages.map((page) =>
              page.filter((chat) => chat._id !== ev.chat._id),
            );

            return {
              ...data,
              pages: pages.map((page, i) => {
                if (i === 0) return [ev.chat, ...page];
                return page;
              }),
            };
          }

          return data;
        },
      );
    };

    socket.on('chats/new-message', handleNewMessage);

    return () => {
      socket.off('chats/new-message', handleNewMessage);
    };
  }, [currentUser]);
}
