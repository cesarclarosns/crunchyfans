import { useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import {
  type UnreadChats,
  unreadChatsSchema,
} from '@/schemas/chats/unread-chats';

export function useGetUnreadChatsQuery() {
  return useQuery({
    queryFn: async (): Promise<UnreadChats> => {
      const response = await api.get('chats/unread');
      return await unreadChatsSchema.parseAsync(response.data);
    },
    queryKey: [],
  });
}
