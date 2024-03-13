import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import {
  type EventPayload,
  type ServerToClientEvents,
} from '@/common/interfaces/socket';
import { socket } from '@/libs/socket';

import { useGetCurrentUserQuery } from '../users/use-get-current-user-query';
import { chatsKeys } from './chats-keys';
import { type InfiniteDataChats } from './use-get-chats-query';
import { type InfiniteDataMessages } from './use-get-messages-query';

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
