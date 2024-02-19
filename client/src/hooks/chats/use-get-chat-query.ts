import { useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type Chat } from '@/models/chats/chat';

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
