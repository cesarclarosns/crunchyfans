'use client';

import { useEffect } from 'react';

import { socket } from '@/libs/socket';

import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { ChatMessagesList } from './chat-messages-list';
import { useChatContext } from './chat-provider';

export function Chat() {
  const {
    state: { chat },
  } = useChatContext();

  useEffect(() => {
    const handleJoinChat = () => {
      socket.emit('chats/join-chat', { chatId: chat._id }, (response) => {
        // console.log('emit chats/join-chat', response);
      });
    };

    handleJoinChat();
    socket.on('connect', handleJoinChat);

    return () => {
      socket.off('connect', handleJoinChat);
    };
  }, [chat]);

  return (
    <div className="flex flex-1 flex-col">
      <ChatHeader />
      <ChatMessagesList />
      <ChatInput />
    </div>
  );
}
