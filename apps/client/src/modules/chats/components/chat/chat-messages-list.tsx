import { endOfDay, format, isEqual } from 'date-fns';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  type EventPayload,
  type ServerToClientEvents,
} from '@/common/interfaces/socket';
import { Icons } from '@/modules/ui/components/icons';
import {
  useGetMessagesQuery,
  type UseGetMessagesQueryParams,
} from '@/modules/chats/hooks/use-get-messages';
import { useReadMessageMutation } from '@/modules/chats/hooks/use-read-message';
import { useGetCurrentUserQuery } from '@/modules/users/hooks/use-get-current-user-query';
import { socket } from '@/modules/socket/libs/socket';
import { type Message } from '@/modules/chats/schemas/message';

import { ChatMessagesListItem } from './chat-messages-list-item';
import { useChatContext } from './chat-provider';

interface MessagesPerDate {
  date: Date;
  messages: Message[];
}

export function ChatMessagesList() {
  const {
    state: { chat, messages },
    dispatch,
  } = useChatContext();

  const { data: currentUser } = useGetCurrentUserQuery();

  const [params, setParams] = useState<UseGetMessagesQueryParams>({
    chatId: chat._id,
  });

  useEffect(() => {
    setParams({ ...params, chatId: chat._id });
  }, [chat]);

  const readMessageMutation = useReadMessageMutation();

  const [typing, setTyping] = useState(false);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } =
    useGetMessagesQuery(params);

  useEffect(() => {
    dispatch({
      payload: (data?.pages ?? []).flat().reverse(),
      type: 'SetMessages',
    });
  }, [data]);

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
      if (ev.chat._id !== chat._id) return;

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
      if (ev.chatId === chat._id && ev.userId !== currentUser?._id) {
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

  // Read last message
  useEffect(() => {
    const lastMessage = messages.at(-1);

    if (!lastMessage || isLoading || !currentUser) return;
    if (lastMessage.seenBy.includes(currentUser._id)) return;

    readMessageMutation.mutate({
      chatId: lastMessage.chatId,
      messageId: lastMessage._id,
    });
  }, [messages, isLoading]);

  // Scroll to last message in the first load
  useEffect(() => {
    if (!isLoading) {
      setTimeout(
        () =>
          containerRef.current?.scrollTo({
            behavior: 'smooth',
            top: containerRef.current?.scrollHeight,
          }),
        1_000,
      );
    }
  }, [isLoading]);

  return (
    <div
      className="flex flex-1 flex-col overflow-y-scroll border-b-2 px-2 py-4 text-sm"
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
