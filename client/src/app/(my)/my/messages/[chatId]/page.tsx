'use client';

import { Chat } from '@/components/chats/chat/chat';
import { ChatProvider } from '@/components/chats/chat/chat-provider';
import { useGetChatQuery } from '@/hooks/chats/use-get-chat-query';

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
