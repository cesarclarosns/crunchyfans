import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/common/libs/apis';

import { useGetCurrentUserQuery } from '../../users/hooks/use-get-current-user-data';
import { chatsKeys } from './chats-keys';
import { type InfiniteDataChats } from './use-get-chats';

export function useReadMessageMutation() {
  const queryClient = useQueryClient();

  const { data: currentUser } = useGetCurrentUserQuery();

  return useMutation({
    mutationFn: async (data: { messageId: string; chatId: string }) => {
      const response = await api.post(
        `chats/${data.chatId}/messages/${data.messageId}/read`,
        data,
      );
      return response.data;
    },
    onMutate: (variables) => {
      // console.log('onMutate', { variables });

      queryClient.setQueriesData(
        { queryKey: chatsKeys.infiniteChats() },
        (data: InfiniteDataChats | undefined) => {
          if (data) {
            return {
              ...data,
              pages: data.pages.map((page) =>
                page.map((chat) => {
                  if (
                    chat.lastMessage._id === variables.messageId &&
                    currentUser
                  ) {
                    chat.lastMessage.seenBy.push(currentUser._id);
                  }
                  return chat;
                }),
              ),
            };
          }
          return data;
        },
      );
    },
    onSettled: (data, error, variables, context) => {
      // console.log('onSettled', { context, data, error, variables });

      if (error) {
        queryClient.setQueriesData(
          { queryKey: chatsKeys.infiniteChats() },
          (data: InfiniteDataChats | undefined) => {
            if (data) {
              return {
                ...data,
                pages: data.pages.map((page) =>
                  page.map((chat) => {
                    if (
                      chat.lastMessage._id === variables.messageId &&
                      currentUser
                    ) {
                      chat.lastMessage.seenBy = chat.lastMessage.seenBy.filter(
                        (p) => p !== currentUser._id,
                      );
                    }
                    return chat;
                  }),
                ),
              };
            }
            return data;
          },
        );
      }
    },
  });
}
