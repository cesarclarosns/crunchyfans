import { useMemo } from 'react';

import { type UserStatus } from '@/common/constants/users';
import { useUsersStatus } from '@/modules/users/hooks/use-users-status';
import { cn } from '@/modules/ui/libs/utils';
import { type User } from '@/modules/users/schemas/user';

import { type Avatar, AvatarFallback, AvatarImage } from '../../modules/ui/components/avatar';
import { UserAvatar } from './user-avatar';

export interface UserAvatarWithStatusProps
  extends React.ComponentProps<typeof Avatar> {
  user: User;
}

export function UserAvatarWithStatus({
  user,
  className,
}: UserAvatarWithStatusProps) {
  const { usersStatus } = useUsersStatus([user._id]);

  return (
    <div className="relative h-fit w-fit">
      <UserAvatar user={user} className="h-24 w-24 text-2xl sm:h-24 sm:w-24" />
      <div className="absolute bottom-6 right-0">
        <span className="relative flex h-3 w-3">
          {usersStatus.online.includes(user._id) ? (
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
  );
}
