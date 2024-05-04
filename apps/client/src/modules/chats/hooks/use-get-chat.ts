import { useQuery } from '@tanstack/react-query';

import { api } from '@/common/libs/apis';
import { type Chat } from '@/modules/chats/schemas/chat';

export function useGetChatQuery(chatId: string | null) {
  return useQuery({
    enabled: !!chatId,
    queryFn: async (): Promise<Chat> => {
      const response = await api.get(`chats/${chatId}`);
      return response.data;
    },
    queryKey: [`chats/${chatId}`],
  });
}
