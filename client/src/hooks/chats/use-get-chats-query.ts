import { useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type Chat } from '@/models/chats/chat';

const DEFAULT_LIMIT = 10;

export type GetChatsParams = {
  pageParam: { skip: number; cursor: string } | undefined;
};

export type GetChatsResponse = Chat[];

export function useGetChatsQuery(params: {
  query: string;
  order: 'recent' | 'old';
}) {
  return useInfiniteQuery({
    getNextPageParam: (lastPage, allPages) => {
      const hasNextPage = lastPage.length === DEFAULT_LIMIT;
      if (!hasNextPage) return undefined;

      const cursor = allPages.at(0)!.at(-1)!.message._id;
      const skip =
        (allPages.length > 1 ? allPages.length - 1 : 0) * DEFAULT_LIMIT;

      return { cursor, skip };
    },
    initialPageParam: undefined,
    queryFn: async ({
      pageParam,
    }: GetChatsParams): Promise<GetChatsResponse> => {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('limit', String(DEFAULT_LIMIT));
      urlSearchParams.set('skip', String(0));

      if (pageParam) {
        urlSearchParams.set('cursor', pageParam.cursor);
        urlSearchParams.set('skip', String(pageParam.skip));
      }
      if (params.query) urlSearchParams.set('query', params.query);
      if (params.order) urlSearchParams.set('order', params.order);

      const response = await api.get(`chats?${urlSearchParams.toString()}`);
      return response.data;
    },
    queryKey: ['chats', params],
  });
}
