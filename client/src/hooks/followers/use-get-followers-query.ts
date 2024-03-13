import { useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type Follower } from '@/schemas/followers/follower';

const DEFAULT_LIMIT = 10;

export type GetFollowersParams = {
  pageParam: { skip: number; cursor: string } | undefined;
};

export type GetFollowersResponse = Omit<Follower, 'followee'>[];

export function useGetFollowersQuery(userId: string) {
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
    queryFn: async ({
      pageParam,
    }: GetFollowersParams): Promise<GetFollowersResponse> => {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('limit', String(DEFAULT_LIMIT));
      urlSearchParams.set('skip', String(0));

      if (pageParam) {
        urlSearchParams.set('cursor', pageParam.cursor);
        urlSearchParams.set('skip', String(pageParam.skip));
      }

      const response = await api.get(
        `followers/${userId}?${urlSearchParams.toString()}`,
      );
      return response.data;
    },
    queryKey: [`followers/${userId}`],
  });
}
