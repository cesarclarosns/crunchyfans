'use client';

import { Chat } from '@/modules/chats/components/chat/chat';
import { ChatProvider } from '@/modules/chats/components/chat/chat-provider';
import { useGetChatQuery } from '@/modules/chats/hooks/use-get-chat';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { data: chat } = useGetChatQuery(params.chatId);

  return (
    <div className="flex flex-1 flex-col">
      {!!chat && (
        <ChatProvider chat={chat}>
          <Chat />
        </ChatProvider>
      )}
    </div>
  );
}
