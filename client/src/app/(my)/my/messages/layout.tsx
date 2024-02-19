'use client';

import { ChatsList } from '@/components/chats/chats-list/chats-list';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <div className="flex basis-1/3 flex-col border-x-2">
        <ChatsList />
      </div>
      <div className="flex basis-2/3 flex-col">{children}</div>
    </div>
  );
}
