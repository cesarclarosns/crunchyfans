import { useEffect, useMemo } from 'react';

import { Avatar } from '@/components/ui/avatar';
import { Icons } from '@/components/ui/icons';
import { UserAvatar } from '@/components/users/user-avatar';
import { useGetChatMessagesQuery } from '@/hooks/chats/use-get-chat-messages-query';
import { useGetChatQuery } from '@/hooks/chats/use-get-chat-query';
import { useGetCurrentUserQuery } from '@/hooks/users';
import { useUsersStatus } from '@/hooks/users/use-users-status';
import { type User } from '@/models/users/user';
import { useChatsStore } from '@/stores/chats-store';

import { useChatContext } from './chat-provider';

export interface ChatHeaderProps {}

export function ChatHeader({}: ChatHeaderProps) {
  const { chat } = useChatContext();
  const { setChatId } = useChatsStore((state) => state);
  const { data: currentUser } = useGetCurrentUserQuery();

  const recipients = useMemo(() => {
    if (!currentUser) return [];
    return chat.participants.filter((p) => p._id !== currentUser._id);
  }, [chat]);

  const { usersStatus } = useUsersStatus(recipients.map((r) => r._id));

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div>
          <Icons.ArrowLeftIcon
            className="h-5 w-5 hover:cursor-pointer"
            onClick={() => setChatId(null)}
          />
        </div>
        {recipients.length === 1 && (
          <div className="relative flex w-fit flex-1 flex-col">
            <UserAvatar user={recipients[0]!} className="h-14 w-14" />
            <div className="absolute bottom-6 right-0">
              <span className="relative flex h-3 w-3">
                {usersStatus.online.includes(recipients[0]!._id) ? (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-600"></span>
                  </>
                ) : (
                  <>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-slate-400"></span>
                  </>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
