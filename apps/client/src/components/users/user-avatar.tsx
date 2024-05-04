import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/modules/ui/components/avatar';
import { type User } from '@/modules/users/schemas/user';

export interface UserAvatarProps extends React.ComponentProps<typeof Avatar> {
  user: User;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage
        src={user?.pictures?.profilePicture?.sources?.at(0)?.fileUrl}
      />
      <AvatarFallback>
        {user.displayName
          ?.split(' ')
          .map((s) => s[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
