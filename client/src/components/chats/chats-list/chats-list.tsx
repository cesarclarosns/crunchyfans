'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import React, { useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import {
  useGetChatsQuery,
  type UseGetChatsQueryParams,
} from '@/hooks/chats/use-get-chats-query';
import { useDebounce } from '@/hooks/use-debounce';

import { ChatsListItem } from './chats-list-item';

export function ChatsList() {
  const [isSearching, setIsSearching] = useState(false);

  const [params, setParams] = useState<UseGetChatsQueryParams>({
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

  const onIsSearchingChange = () => {
    if (isSearching) {
      setParams({ ...params, query: '' });
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  };

  const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, query: ev.target.value });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b-2 px-2 py-1 backdrop-blur-sm">
        <div>
          <Icons.ArrowLeftIcon className="h-6 w-6" />
        </div>

        <div className="flex flex-1 truncate">
          {isSearching ? (
            <>
              <Input
                placeholder="Search..."
                className="h-fit border-0 px-0 py-0 text-base"
                onChange={onInputChange}
              />
            </>
          ) : (
            <p className="truncate text-xl font-semibold">Messages</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isSearching ? (
            <Icons.XIcon
              className="h-5 w-5 hover:cursor-pointer"
              onClick={onIsSearchingChange}
            />
          ) : (
            <Icons.Search
              className="h-5 w-5 hover:cursor-pointer"
              onClick={onIsSearchingChange}
            />
          )}
        </div>
      </div>

      <div className="flex min-h-fit items-center justify-between gap-4 px-2 py-2">
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
