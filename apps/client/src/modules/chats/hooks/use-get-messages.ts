import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/common/libs/apis';
import { type Message } from '@/modules/chats/schemas/message';

import { chatsKeys } from './chats-keys';

const DEFAULT_LIMIT = 10;

export type UseGetMessagesQueryParams = {
  chatId: string | null;
};

type Param = {
  pageParam: { skip: number; cursor: string } | undefined;
};

export type InfiniteDataMessages = InfiniteData<Array<Message>, Array<Param>>;

export function useGetMessagesQuery(params: UseGetMessagesQueryParams) {
  return useInfiniteQuery({
    enabled: !!params.chatId,
    getNextPageParam: (lastPage, allPages) => {
      const hasNextPage = lastPage.length === DEFAULT_LIMIT;
      if (!hasNextPage) return undefined;

      const cursor = allPages.at(0)!.at(-1)!._id;
      const skip =
        (allPages.length > 1 ? allPages.length - 1 : 0) * DEFAULT_LIMIT;

      return { cursor, skip };
    },
    initialPageParam: undefined,
    queryFn: async ({ pageParam }: Param): Promise<Array<Message>> => {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('limit', String(DEFAULT_LIMIT));
      urlSearchParams.set('skip', String(0));

      if (pageParam) {
        urlSearchParams.set('cursor', pageParam.cursor);
        urlSearchParams.set('skip', String(pageParam.skip));
      }

      const response = await api.get(
        `chats/${params.chatId}/messages?${urlSearchParams.toString()}`,
      );

      return response.data;
    },
    queryKey: chatsKeys.infiniteMessageList(params),
    staleTime: 0,
  });
}
