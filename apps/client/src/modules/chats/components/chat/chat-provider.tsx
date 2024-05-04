import { createContext, type Dispatch, useContext, useReducer } from 'react';

import { type Chat } from '@/modules/chats/schemas/chat';
import { type Message } from '@/modules/chats/schemas/message';

type ChatState = {
  chat: Chat;
  messages: Message[];
};

type ChatAction = {
  type: 'SetMessages';
  payload: ChatState['messages'];
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SetMessages':
      return { ...state, messages: action.payload };
    default:
      throw new Error(`No action defined for: ${action.type}`);
  }
}

export const ChatContext = createContext<{
  state: ChatState;
  dispatch: Dispatch<ChatAction>;
} | null>(null);

export function ChatProvider({
  children,
  chat,
}: {
  children: React.ReactNode;
  chat: Chat;
}) {
  const [state, dispatch] = useReducer(chatReducer, { chat, messages: [] });

  return (
    <ChatContext.Provider value={{ dispatch, state }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);

  if (!context)
    throw new Error('useChatContext must be used with a ChatProvider');

  return context;
}
