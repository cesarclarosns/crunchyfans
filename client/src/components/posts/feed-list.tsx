'use client';

import { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import { Icons } from '@/components/ui/icons';
import { useGetFeedQuery } from '@/hooks/posts/use-get-feed-query';
import { cn } from '@/libs/utils';

import { Post } from './post';

export function FeedList() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetFeedQuery();
  const posts = useMemo(() => (data?.pages ?? []).flat(), [data]);

  const { ref: inViewRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage && !isLoading) {
        fetchNextPage().then();
      }
    },
    threshold: 1,
  });

  return (
    <div className="flex flex-1 flex-col">
      {posts.map((post) => (
        <Post post={post} key={post._id} className="border-b-2 px-5 py-10" />
      ))}

      <div ref={inViewRef} className="flex flex-col items-center py-5">
        <Icons.Loader2Icon
          className={cn(isFetchingNextPage ? 'animate-spin' : '')}
        />
      </div>
    </div>
  );
}
