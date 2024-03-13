import { useMutation } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type Chat } from '@/schemas/chats/chat';

export function useCreateChatMutation() {
  return useMutation({
    mutationFn: async (data: { participants: string[] }): Promise<Chat> => {
      const response = await api.post('chats', data);
      return response.data;
    },
  });
}
