import { useMutation } from '@tanstack/react-query';

import { api } from '@/common/libs/apis';
import { type Chat } from '@/modules/chats/schemas/chat';

export function useCreateChatMutation() {
  return useMutation({
    mutationFn: async (data: { participants: string[] }): Promise<Chat> => {
      const response = await api.post('chats', data);
      return response.data;
    },
  });
}
