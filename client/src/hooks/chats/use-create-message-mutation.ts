import { useMutation } from '@tanstack/react-query';

import { type CreateMessage } from '@/schemas/chats/create-message';
import { api } from '@/libs/apis';
import { type Message } from '@/schemas/chats/message';

export function useCreateMessageMutation() {
  return useMutation({
    mutationFn: async (data: CreateMessage): Promise<Message> => {
      const response = await api.post(`chats/${data.chatId}/messages`, data);
      return response.data;
    },
    mutationKey: [],
  });
}
