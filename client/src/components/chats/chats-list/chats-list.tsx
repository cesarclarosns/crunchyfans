'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  type EventPayload,
  type ServerToClientEvents,
} from '@/common/interfaces/socket';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { useGetChatsQuery } from '@/hooks/chats/use-get-chats-query';
import { useDebounce } from '@/hooks/use-debounce';
import { socket } from '@/libs/socket';

import { ChatsListItem } from './chats-list-item';

export function ChatsList() {
  const [isSearching, setIsSearching] = useState(false);

  const [params, setParams] = useState<{
    order: 'recent' | 'old';
    query: string;
  }>({
    order: 'recent',
    query: '',
  });
  const debouncedParams = useDebounce(params);

  const { data, isFetchingNextPage, hasNextPage, isLoading, fetchNextPage } =
    useGetChatsQuery(debouncedParams);
  const chats = useMemo(() => data?.pages?.flat(2) ?? [], [data]);

  const containerRef = useRef<HTMLDivElement | null>(null);
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

  const handleIsSearchingChange = () => {
    if (isSearching) {
      setParams({ ...params, query: '' });
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  };

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, query: ev.target.value });
  };

  useEffect(() => {
    const handleNewChat = (
      ev: EventPayload<ServerToClientEvents['chats/new-chat']>,
    ) => {
      const { chat, chatId } = ev;
      console.log('on chats/new-chat', ev);
    };

    socket.on('chats/new-chat', handleNewChat);

    return () => {
      socket.off('chats/new-chat', handleNewChat);
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col">
        <div className="sticky top-0 z-50 flex min-h-fit flex-col border-b-2 px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div>
              <Icons.ArrowLeftIcon className="h-5 w-5" />
            </div>
            <div className="flex flex-1 items-center gap-2">
              {/* <p className="text-xl font-bold">{userProfile.displayName}</p> */}
              <Icons.BadgeCheckIcon className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="flex h-4 items-center justify-between gap-4 py-4">
          {isSearching ? (
            <>
              <Input
                placeholder="Search"
                className="h-fit flex-1"
                onChange={handleInputChange}
              />
            </>
          ) : (
            <p className="text-lg font-bold">Messages</p>
          )}

          <div className="flex items-center gap-2">
            {isSearching ? (
              <Icons.XIcon
                className="h-5 w-5 hover:cursor-pointer"
                onClick={handleIsSearchingChange}
              />
            ) : (
              <Icons.Search
                className="h-5 w-5 hover:cursor-pointer"
                onClick={handleIsSearchingChange}
              />
            )}
          </div>
        </div>

        <div className="flex min-h-fit items-center justify-between gap-4 py-4">
          <p>{params.order === 'recent' ? 'Newest first' : 'Oldest first'}</p>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Icons.ListFilter className="h-5 w-5 hover:cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setParams({ ...params, order: 'recent' })}
                >
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setParams({ ...params, order: 'old' })}
                >
                  Oldest first
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div
        className="flex flex-1 flex-col overflow-y-scroll"
        style={{ scrollbarWidth: 'none' }}
        ref={containerRef}
      >
        {chats.map((chat) => (
          <ChatsListItem chat={chat} key={chat._id} />
        ))}

        <div className="flex flex-col items-center" ref={inViewRef}>
          {isFetchingNextPage && <Icons.Loader2Icon className="animate-spin" />}
        </div>
      </div>
    </div>
  );
}
