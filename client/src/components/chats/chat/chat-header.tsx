import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { Icons } from '@/components/ui/icons';
import { useGetCurrentUserQuery } from '@/hooks/users/use-get-current-user-query';
import { useUsersStatus } from '@/hooks/users/use-users-status';

import { useChatContext } from './chat-provider';

export function ChatHeader() {
  const router = useRouter();
  const {
    state: { chat },
  } = useChatContext();
  const { data: currentUser } = useGetCurrentUserQuery();

  const recipients = useMemo(() => {
    if (!currentUser) return [];
    return chat.participants.filter((p) => p._id !== currentUser._id);
  }, [chat]);

  const recipient = recipients.at(0);

  const { usersStatus } = useUsersStatus(recipients.map((r) => r._id));

  return (
    <div className="flex h-14 items-center gap-2 border-b-2 px-2 py-1">
      <div>
        <Icons.ArrowLeftIcon
          className=" h-6 w-6 hover:cursor-pointer"
          onClick={() => router.push('/my/messages')}
        />
      </div>

      <div className="flex flex-1 items-center gap-2">
        {recipient ? (
          <>
            <div>
              <p className="font-semibold">{recipient.displayName}</p>
              {usersStatus.online.includes(recipient._id) ? (
                <p className="text-xs">Available now</p>
              ) : null}
            </div>
          </>
        ) : null}
      </div>

      <div>
        <Icons.MoreVertical className="h-6 w-6" />
      </div>
    </div>
  );
}
