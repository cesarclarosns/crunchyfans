import { formatRelative } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { locale } from '@/common/locales/dates/en';
import { Icons } from '@/components/ui/icons';
import { UserAvatar } from '@/components/users/user-avatar';
import { useIsMessageRead } from '@/hooks/chats/use-is-message-read';
import { useIsMessageSeen } from '@/hooks/chats/use-is-message-seen';
import { useGetCurrentUserQuery } from '@/hooks/users/use-get-current-user-query';
import { cn } from '@/libs/utils';
import { type Chat } from '@/schemas/chats/chat';

export type ChatsListItemProps = {
  chat: Chat;
};

export function ChatsListItem({ chat }: ChatsListItemProps) {
  const router = useRouter();
  const { data: currentUser } = useGetCurrentUserQuery();

  const recipients = useMemo(() => {
    if (!currentUser) return [];
    return chat.participants.filter((p) => p._id !== currentUser._id);
  }, [chat, currentUser]);

  const recipient = recipients.at(0);

  const createdAt = useMemo<string>(
    () =>
      formatRelative(new Date(chat.lastMessage.createdAt), new Date(), {
        locale,
      }),
    [chat],
  );

  const isSeen = useIsMessageSeen(chat.lastMessage);
  const isRead = useIsMessageRead(chat.lastMessage);

  return (
    <div
      className="flex min-h-fit items-center rounded-sm px-2 py-5 text-sm hover:cursor-pointer hover:bg-secondary"
      onClick={() => router.push(`/my/messages/${chat._id}`)}
    >
      <div>{recipient ? <UserAvatar user={recipient} /> : null}</div>
      <div className="flex-1 pl-2">
        <div className="flex flex-nowrap gap-2 truncate">
          {recipient ? (
            <>
              <div className="basis-1/2 truncate">{recipient.displayName}</div>
              <div className="basis-1/2 truncate text-end">
                @{recipient.username}
              </div>
            </>
          ) : null}
        </div>

        <div
          className={cn(
            'flex flex-nowrap justify-between gap-2 truncate text-sm',
            isRead ? ' font-light' : 'font-semibold',
          )}
        >
          <div className="flex-1 truncate">{chat.lastMessage.content}</div>
          <div className="flex items-center gap-1">
            <span>{createdAt}</span>

            {chat.lastMessage.userId === currentUser?._id ? (
              <>
                {isSeen ? (
                  <Icons.CheckCheckIcon className="h-4 w-4" />
                ) : (
                  <Icons.CheckIcon className="h-4 w-4" />
                )}
              </>
            ) : (
              <>
                {!isRead && (
                  <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-primary" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
