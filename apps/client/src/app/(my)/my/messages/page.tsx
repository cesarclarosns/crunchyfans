'use client';

import { ChatFallback } from '@/modules/chats/components/chat/chat-fallback';

export default function MyMessagesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ChatFallback />
    </div>
  );
}
