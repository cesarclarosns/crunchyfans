'use client';

import { usePathname } from 'next/navigation';

import { ChatsList } from '@/modules/chats/components/chats-list/chats-list';
import { cn } from '@/modules/ui/libs/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-1">
      <div
        className={cn(
          'sm:border-x-2',
          pathname === '/my/messages'
            ? 'flex flex-1 flex-col sm:basis-1/3'
            : 'hidden sm:flex sm:basis-1/3 sm:flex-col',
        )}
      >
        <ChatsList />
      </div>
      <div
        className={cn(
          'sm:border-r-2',
          pathname === '/my/messages'
            ? 'hidden sm:flex sm:basis-2/3 sm:flex-col'
            : 'flex flex-1 flex-col sm:basis-2/3',
        )}
      >
        {props.children}
      </div>
    </div>
  );
}
