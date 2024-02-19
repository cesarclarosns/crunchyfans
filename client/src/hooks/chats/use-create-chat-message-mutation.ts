import { type ChatMessage } from '@livekit/components-react';
import { useMutation } from '@tanstack/react-query';

import { type CreateChatMessage } from '@/common/schemas/chats/create-chat-message.schema';
import { api } from '@/libs/apis';

export function useCreateChatMessageMutation() {
  return useMutation({
    mutationFn: async (data: CreateChatMessage): Promise<ChatMessage> => {
      const response = await api.post(`chats/${data.chatId}/messages`, data);
      return response.data;
    },
    mutationKey: [],
  });
}
