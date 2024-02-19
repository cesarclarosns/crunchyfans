import { format, formatDistanceToNowStrict, formatRelative } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { locale } from '@/common/locales/dates/en';
import { Icons } from '@/components/ui/icons';
import { UserAvatar } from '@/components/users/user-avatar';
import { useGetCurrentUserQuery } from '@/hooks/users';
import { cn } from '@/libs/utils';
import { type Chat } from '@/models/chats/chat';
import { useChatsStore } from '@/stores/chats-store';

export type ChatsListItemProps = {
  chat: Chat;
};

export function ChatsListItem({ chat }: ChatsListItemProps) {
  const router = useRouter();
  const { data: currentUser } = useGetCurrentUserQuery();
  const { setChatId } = useChatsStore((state) => state);

  const recipients = useMemo(() => {
    if (!currentUser) return [];
    return chat.participants.filter((p) => p._id !== currentUser._id);
  }, [chat, currentUser]);

  const messageCreatedAt = useMemo(
    () =>
      formatRelative(new Date(chat.message.createdAt), new Date(), {
        locale,
      }),
    [chat],
  );

  return (
    <div
      className="flex min-h-fit items-center rounded-sm px-2 py-5 text-sm hover:cursor-pointer hover:bg-secondary"
      onClick={() => router.push(`/my/messages/${chat._id}`)}
    >
      <div>
        {recipients.length === 1 && <UserAvatar user={recipients[0]!} />}
      </div>
      <div className="flex-1 pl-2">
        <div className="flex flex-nowrap gap-2 truncate">
          {recipients.length === 1 && (
            <>
              <div className="basis-1/2 truncate">
                {recipients[0]!.displayName}
              </div>
              <div className="basis-1/2 truncate text-end">
                @{recipients[0]!.username}
              </div>
            </>
          )}
        </div>
        <div
          className={cn(
            'flex flex-nowrap justify-between gap-2 truncate text-sm',
            chat.message.isSeen ? ' font-light' : 'font-semibold',
          )}
        >
          <div className="flex-1 truncate">{chat.message.content}</div>
          <div className="">
            <span>{messageCreatedAt}</span>
            {!chat.message.isSeen && (
              <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
