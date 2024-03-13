import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type Post } from '@/schemas/posts/post';

import { postsKeys } from './posts-keys';

export type UseGetPostsQueryParams = {
  userId: string;
};

export type Param = {
  pageParam: { skip: number; cursor: string } | undefined;
};

export type InfiniteDataPosts = InfiniteData<Array<Post>, Array<Param>>;

const DEFAULT_LIMIT = 10;

export function useGetPostsQuery(param: UseGetPostsQueryParams) {
  return useInfiniteQuery({
    getNextPageParam: (lastPage, allPages) => {
      const hasNextPage = lastPage.length === DEFAULT_LIMIT;
      if (!hasNextPage) return undefined;

      const cursor = allPages.at(0)!.at(-1)!._id;
      const skip =
        (allPages.length > 1 ? allPages.length - 1 : 0) * DEFAULT_LIMIT;

      return { cursor, skip };
    },
    initialPageParam: undefined,
    queryFn: async ({ pageParam }: Param): Promise<Array<Post>> => {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('limit', String(DEFAULT_LIMIT));
      urlSearchParams.set('skip', String(0));

      if (pageParam) {
        urlSearchParams.set('cursor', pageParam.cursor);
        urlSearchParams.set('skip', String(pageParam.skip));
      }
      urlSearchParams.set('user', param.userId);

      const response = await api.get('posts?' + urlSearchParams.toString());
      return response.data;
    },
    queryKey: postsKeys.infinitePostsList(param),
  });
}
