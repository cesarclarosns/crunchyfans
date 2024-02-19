import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type ChatMessage } from '@/models/chats/chat-message';

const DEFAULT_LIMIT = 10;

type Param = {
  pageParam: { skip: number; cursor: string } | undefined;
};

export type InfiniteDataChatMessages = InfiniteData<
  Array<ChatMessage>,
  Array<Param>
>;

export function useGetChatMessagesQuery(params: {
  chatId: string | null;
  order: 'recent' | 'old';
}) {
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
    queryFn: async ({ pageParam }: Param): Promise<Array<ChatMessage>> => {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('limit', String(DEFAULT_LIMIT));
      urlSearchParams.set('skip', String(0));

      if (pageParam) {
        urlSearchParams.set('cursor', pageParam.cursor);
        urlSearchParams.set('skip', String(pageParam.skip));
      }
      if (params.order) urlSearchParams.set('order', params.order);

      const response = await api.get(
        `chats/${params.chatId}/messages?${urlSearchParams.toString()}`,
      );

      return response.data;
    },
    queryKey: [`chats/${params.chatId}/messages`, params],
  });
}
