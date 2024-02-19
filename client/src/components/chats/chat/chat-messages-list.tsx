import { useQueryClient } from '@tanstack/react-query';
import { endOfDay, format, isEqual } from 'date-fns';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  type EventPayload,
  type ServerToClientEvents,
} from '@/common/interfaces/socket';
import { Icons } from '@/components/ui/icons';
import {
  type InfiniteDataChatMessages,
  useGetChatMessagesQuery,
} from '@/hooks/chats/use-get-chat-messages-query';
import { socket } from '@/libs/socket';
import { type ChatMessage } from '@/models/chats/chat-message';

import { ChatMessagesListItem } from './chat-messages-list-item';
import { useChatContext } from './chat-provider';

interface MessagesPerDate {
  date: Date;
  messages: ChatMessage[];
}

export function ChatMessagesList() {
  const { chat } = useChatContext();

  const [params, setParams] = useState<{
    chatId: string | null;
    order: 'recent' | 'old';
  }>({ chatId: chat._id, order: 'recent' });

  useEffect(() => {
    setParams({ ...params, chatId: chat._id });
  }, [chat]);

  const queryClient = useQueryClient();

  const [typing, setTyping] = useState(false);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } =
    useGetChatMessagesQuery(params);

  const messages = useMemo(() => (data?.pages ?? []).flat().reverse(), [data]);

  const messagesPerDate = useMemo(() => {
    return messages.reduce((acc, curr) => {
      const date = endOfDay(new Date(curr.createdAt));

      let index = acc.findIndex((item) => isEqual(item.date, date));
      if (index !== -1) {
        acc[index]?.messages.push(curr);
      } else {
        acc.push({ date, messages: [curr] });
      }

      return acc;
    }, [] as MessagesPerDate[]);
  }, [messages]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const userTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { ref: inViewRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage && !isLoading) {
        const prevScrollHeight = containerRef.current?.scrollHeight;

        fetchNextPage().then(() => {
          setTimeout(() => {
            containerRef.current?.scrollTo({
              behavior: 'auto',
              top: containerRef.current?.scrollHeight! - prevScrollHeight!,
            });
          }, 0);
        });
      }
    },
    threshold: 1,
  });

  useEffect(() => {
    const handleNewMessage = (
      ev: EventPayload<ServerToClientEvents['chats/new-message']>,
    ) => {
      if (ev.chatId !== chat._id) return;

      queryClient.setQueryData(
        [`chats/${chat._id}/messages`, params],
        (data: InfiniteDataChatMessages) => {
          return {
            pageParams: [...data.pageParams],
            pages: [
              [ev.message, ...(data.pages.at(0) ?? [])],
              ...data.pages.slice(1),
            ],
          };
        },
      );

      setTimeout(
        () =>
          containerRef.current?.scrollTo({
            behavior: 'smooth',
            top: containerRef.current?.scrollHeight,
          }),
      );
    };

    const handleUserTyping = (
      ev: EventPayload<ServerToClientEvents['chats/user-typing']>,
    ) => {
      if (ev.chatId === chat._id) {
        setTyping(true);

        if (userTypingTimeoutRef.current) {
          clearTimeout(userTypingTimeoutRef.current);
        }
        userTypingTimeoutRef.current = setTimeout(() => setTyping(false), 1000);
        setTimeout(
          () =>
            containerRef.current?.scrollTo({
              behavior: 'smooth',
              top: containerRef.current?.scrollHeight,
            }),
        );
      }
    };

    socket.on('chats/new-message', handleNewMessage);
    socket.on('chats/user-typing', handleUserTyping);

    return () => {
      socket.off('chats/new-message', handleNewMessage);
      socket.off('chats/user-typing', handleUserTyping);
    };
  }, [params]);

  return (
    <div
      className="flex flex-1 flex-col overflow-y-scroll rounded-md border-[1px] px-2 py-4 text-sm"
      style={{ scrollbarWidth: 'none' }}
      ref={containerRef}
    >
      <div className="flex flex-col items-center" ref={inViewRef}>
        {isFetchingNextPage && <Icons.Loader2Icon className="animate-spin" />}
      </div>

      {messagesPerDate.map(({ date, messages }) => {
        return (
          <React.Fragment key={date.toISOString()}>
            <div className="flex min-h-fit flex-col items-center py-4">
              <div className="min-w-fit rounded-md bg-accent px-2 py-1 text-xs">
                {format(date, 'yyyy, MMM, dd')}
              </div>
            </div>
            {messages.map((message) => (
              <ChatMessagesListItem message={message} key={message._id} />
            ))}
          </React.Fragment>
        );
      })}

      {typing && <Typing />}
    </div>
  );
}

export function Typing() {
  return (
    <div className="mr-5 flex min-h-fit gap-2 self-start text-wrap rounded-xl rounded-tl-none bg-accent px-3 py-3">
      <div className="h-1 w-1 animate-fade rounded-full bg-muted-foreground delay-100" />
      <div className="h-1 w-1 animate-fade rounded-full bg-muted-foreground delay-300" />
      <div className="h-1 w-1 animate-fade rounded-full bg-muted-foreground delay-500" />
    </div>
  );
}
