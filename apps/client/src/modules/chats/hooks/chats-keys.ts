import { type UseGetChatsQueryParams } from './use-get-chats';
import { type UseGetMessagesQueryParams } from './use-get-messages';

export const chatsKeys = {
  all: () => ['chats'] as const,
  detail: (id: string | null) => [...chatsKeys.details(), id] as const,
  details: () => [...chatsKeys.all(), 'detail'] as const,
  infiniteChats: () => ['infiniteChats'] as const,
  infiniteChatsList: (params: UseGetChatsQueryParams) => [
    ...chatsKeys.infiniteChats(),
    params,
  ],
  infiniteMessageList: (params: UseGetMessagesQueryParams) =>
    [...chatsKeys.infiniteMessages(), params] as const,
  infiniteMessages: () => ['infiniteMessages'] as const,
};
