'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icons } from '@/components/ui/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/components/users/user-avatar';
import { UserDropdownMenu } from '@/components/users/user-dropdown-menu';
import { useGetCurrentUserQuery } from '@/hooks/users/use-get-current-user-query';
import { cn } from '@/libs/utils';
import { useChatsStore } from '@/stores/chats-store';

import { Badge } from './ui/badge';

export function NavBar() {
  const { data: user } = useGetCurrentUserQuery();
  const pathname = usePathname();

  const { unreadChats } = useChatsStore((state) => state);

  return (
    <nav
      className={cn(
        'sticky bottom-0 z-50 flex flex-row gap-5 bg-background py-3 max-sm:items-center max-sm:justify-between max-sm:border-t-2 max-sm:px-10 sm:flex-col sm:px-5 sm:py-5 md:px-10',
      )}
    >
      <div className="max-sm:hidden">
        {user ? (
          <UserDropdownMenu
            triggerChildren={<UserAvatar user={user} className="h-7 w-7" />}
          ></UserDropdownMenu>
        ) : (
          <Skeleton className="h-7 w-7 rounded-full" />
        )}
      </div>

      <Link
        href={'/'}
        className={cn(
          'flex items-center gap-4 hover:cursor-pointer hover:text-primary',
          pathname != '/' && 'text-muted-foreground',
        )}
      >
        <Icons.Home className="h-7 w-7 stroke-2" />
        <span className="text-lg font-semibold max-md:hidden">Home</span>
      </Link>

      {/* <Link
        href={'/my/notifications'}
        className={cn(
          'flex items-center gap-4 text-muted-foreground hover:cursor-pointer hover:text-primary',
          !pathname.startsWith('/my/notifications') && 'text-muted-foreground',
        )}
      >
        <Icons.BellIcon className="h-7 w-7 stroke-2" />
        <span className="text-lg font-semibold max-md:hidden">
          Notifications
        </span>
      </Link> */}

      <Link
        href={'/my/messages'}
        className={cn(
          'items-center gap-4 hover:cursor-pointer hover:text-primary sm:flex',
          !pathname.startsWith('/my/messages') && 'text-muted-foreground',
        )}
      >
        <div className="relative">
          <Icons.MessageCircleIcon className="h-7 w-7 stroke-2" />
          {!!unreadChats && (
            <Badge className="absolute -right-3 top-0 px-2 py-0">
              {unreadChats}
            </Badge>
          )}
        </div>
        <span className="text-lg font-semibold max-md:hidden">Messages</span>
      </Link>

      <Link
        href={`/${user?.username}`}
        className={cn(
          'hidden items-center gap-4 hover:cursor-pointer hover:text-primary sm:flex',
          pathname != `/${user?.username}` && 'text-muted-foreground',
        )}
      >
        <Icons.CircleUserIcon className="h-7 w-7 stroke-2" />
        <span className="text-lg font-semibold max-md:hidden">Profile</span>
      </Link>

      <Link
        href={'/posts/create'}
        className={cn(
          'flex items-center gap-4 text-muted-foreground hover:cursor-pointer hover:text-primary',
          !pathname.startsWith('/posts/create') && 'text-muted-foreground',
        )}
      >
        <Icons.PlusSquareIcon className="h-7 w-7 stroke-2" />
        <span className="text-lg font-semibold max-md:hidden">Create</span>
      </Link>

      <Link
        href={'/my/payments'}
        className={cn(
          'hidden items-center gap-4 text-muted-foreground hover:cursor-pointer hover:text-primary sm:flex',
          !pathname.startsWith('/my/payments') && 'text-muted-foreground',
        )}
      >
        <Icons.CreditCardIcon className="h-7 w-7 stroke-2" />
        <span className="text-lg font-semibold max-md:hidden">Add card</span>
      </Link>

      <div className="sm:hidden">
        {user ? (
          <UserDropdownMenu
            triggerChildren={<UserAvatar user={user} className="h-7 w-7" />}
          ></UserDropdownMenu>
        ) : (
          <Skeleton className="h-7 w-7 rounded-full" />
        )}
      </div>
    </nav>
  );
}
