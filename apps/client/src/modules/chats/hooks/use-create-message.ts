import { useMutation } from '@tanstack/react-query';

import { type CreateMessage } from '@/modules/chats/schemas/create-message';
import { api } from '@/common/libs/apis';
import { type Message } from '@/modules/chats/schemas/message';

export function useCreateMessageMutation() {
  return useMutation({
    mutationFn: async (data: CreateMessage): Promise<Message> => {
      const response = await api.post(`chats/${data.chatId}/messages`, data);
      return response.data;
    },
    mutationKey: [],
  });
}
