'use client';

import { useMemo } from 'react';

import { locale } from '@/common/locales/dates/en';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useGetCurrentUserQuery } from '@/hooks/users';
import { cn } from '@/libs/utils';
import { type ChatMessage } from '@/models/chats/chat-message';

interface ChatMessagesListItemProps {
  message: ChatMessage;
}

export function ChatMessagesListItem({ message }: ChatMessagesListItemProps) {
  const { data: user } = useGetCurrentUserQuery();

  const createdAt = useMemo(
    () =>
      new Date(message.createdAt)
        .toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
        .toLowerCase(),
    [message],
  );

  return (
    <div
      className={cn(
        'my-2 min-h-fit text-wrap rounded-xl px-3 py-2',
        user?._id === message.userId
          ? 'ml-5 self-end rounded-tr-none bg-secondary-foreground text-secondary'
          : 'mr-5 self-start rounded-tl-none bg-accent',
      )}
    >
      <div className="div flex justify-between gap-5 truncate text-muted-foreground">
        <span className="truncate text-xs">@{message.user?.username}</span>
        <span className="truncate text-xs">{createdAt}</span>
      </div>
      <div>
        <Carousel>
          <CarouselContent>
            <CarouselItem></CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <p className="text-left">{message.content} </p>
      </div>
    </div>
  );
}
