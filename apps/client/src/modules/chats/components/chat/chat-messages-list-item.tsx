'use client';

import { formatRelative } from 'date-fns';
import { useMemo } from 'react';

import { locale } from '@/common/locales/dates/en';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/modules/ui/components/carousel';
import { Icons } from '@/modules/ui/components/icons';
import { useIsMessageSeen } from '@/modules/chats/hooks/use-is-message-seen';
import { useGetCurrentUserQuery } from '@/modules/users/hooks/use-get-current-user-query';
import { cn } from '@/modules/ui/libs/utils';
import { type Message } from '@/modules/chats/schemas/message';

import { useChatContext } from './chat-provider';

interface ChatMessagesListItemProps {
  message: Message;
}

export function ChatMessagesListItem({ message }: ChatMessagesListItemProps) {
  const {
    state: { messages },
  } = useChatContext();

  const { data: currentUser } = useGetCurrentUserQuery();

  const createdAt = useMemo<string>(
    () =>
      formatRelative(new Date(message.createdAt), new Date(), {
        locale,
      }),
    [message],
  );

  const isLastMessageSeen = useIsMessageSeen(messages.at(-1)!);
  const isSeen = useIsMessageSeen(message);

  return (
    <div
      className={cn(
        'my-2 min-h-fit text-wrap rounded-xl px-3 py-2',
        currentUser?._id === message.userId
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
      </div>

      <p className="text-wrap break-all text-left">{message.content}</p>

      {message.userId === currentUser?._id && (
        <div className="flex justify-end">
          {isSeen || isLastMessageSeen ? (
            <Icons.CheckCheckIcon className="h-4 w-4" />
          ) : (
            <Icons.CheckIcon className="h-4 w-4" />
          )}
        </div>
      )}
    </div>
  );
}
