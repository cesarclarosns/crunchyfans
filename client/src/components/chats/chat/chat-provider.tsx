import { createContext, useContext } from 'react';

import { type Chat } from '@/models/chats/chat';

export const ChatContext = createContext<{ chat: Chat } | null>(null);

export function ChatProvider({
  children,
  chat,
}: {
  children: React.ReactNode;
  chat: Chat;
}) {
  return (
    <ChatContext.Provider value={{ chat }}>{children}</ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);

  if (!context)
    throw new Error('useChatContext must be used with a ChatProvider');

  return context;
}
