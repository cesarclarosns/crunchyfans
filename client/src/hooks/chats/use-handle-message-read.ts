import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import {
  type EventPayload,
  type ServerToClientEvents,
} from '@/common/interfaces/socket';
import { socket } from '@/libs/socket';

import { chatsKeys } from './chats-keys';
import { type InfiniteDataChats } from './use-get-chats-query';
import { type InfiniteDataMessages } from './use-get-messages-query';

export function useHandleMessageRead() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleMessageRead = (
      ev: EventPayload<ServerToClientEvents['chats/message-read']>,
    ) => {
      // console.log('on chats/message-read', ev);

      queryClient.setQueriesData(
        { queryKey: chatsKeys.infiniteMessages() },
        (data: InfiniteDataMessages | undefined) => {
          if (data) {
            return {
              ...data,
              pages: [
                ...data.pages.map((page) =>
                  page.map((message) => {
                    if (message._id !== ev.messageId) return message;
                    return {
                      ...message,
                      seenBy: Array.from(
                        new Set([...message.seenBy, ev.userId]),
                      ),
                    };
                  }),
                ),
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
            return {
              ...data,
              pages: data.pages.map((page) =>
                page.map((chat) => {
                  if (chat.lastMessage._id !== ev.messageId) return chat;
                  return {
                    ...chat,
                    lastMessage: {
                      ...chat.lastMessage,
                      seenBy: Array.from(
                        new Set([...chat.lastMessage.seenBy, ev.userId]),
                      ),
                    },
                  };
                }),
              ),
            };
          }

          return data;
        },
      );
    };

    socket.on('chats/message-read', handleMessageRead);

    return () => {
      socket.off('chats/message-read', handleMessageRead);
    };
  }, []);

  return {};
}
