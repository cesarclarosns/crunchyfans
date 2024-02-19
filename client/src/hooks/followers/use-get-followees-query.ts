import { useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type Follower } from '@/models/followers/follower';

const DEFAULT_LIMIT = 10;

export type GetFolloweesParams = {
  pageParam: { skip: number; cursor: string } | undefined;
};

export type GetFolloweesResponse = Omit<Follower, 'follower'>[];

export function useGetFolloweesQuery(userId: string) {
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
    }: GetFolloweesParams): Promise<GetFolloweesResponse> => {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('limit', String(DEFAULT_LIMIT));
      urlSearchParams.set('skip', String(0));

      if (pageParam) {
        urlSearchParams.set('cursor', pageParam.cursor);
        urlSearchParams.set('skip', String(pageParam.skip));
      }

      const response = await api.get(
        `followers/${userId}/followees?${urlSearchParams.toString()}`,
      );
      return response.data;
    },
    queryKey: [`followers/${userId}/followees`],
  });
}
