'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CreatePostFormDialog } from '@/components/posts/forms/create-post-form-dialog';
import { DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/ui/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/components/users/user-avatar';
import { UserDropdownMenu } from '@/components/users/user-dropdown-menu';
import { useGetCurrentUserQuery } from '@/hooks/users';
import { cn } from '@/libs/utils';

export function NavBar() {
  const { data: user } = useGetCurrentUserQuery();
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'sticky bottom-0 z-50 flex flex-row gap-5 bg-background py-3 max-sm:items-center max-sm:justify-between max-sm:border-t-2 max-sm:px-10 sm:flex-col sm:px-5 sm:py-5 md:px-10',
      )}
    >
      <div className="max-sm:hidden">
        {user ? (
          <UserDropdownMenu
            triggerChildren={<UserAvatar user={user} className="h-8 w-8" />}
          ></UserDropdownMenu>
        ) : (
          <Skeleton className="h-8 w-8 rounded-full" />
        )}
      </div>

      <Link
        href={'/'}
        className={cn(
          'flex items-center gap-2 hover:cursor-pointer hover:text-primary',
          pathname != '/' && 'text-muted-foreground',
        )}
      >
        <Icons.Home className="stroke-2" />
        <span className="font-semibold max-md:hidden">Home</span>
      </Link>

      <CreatePostFormDialog
        trigger={
          <DialogTrigger
            className={cn(
              'flex items-center gap-2 text-muted-foreground hover:cursor-pointer hover:text-primary',
            )}
          >
            <Icons.PlusSquareIcon className="stroke-2"></Icons.PlusSquareIcon>
            <span className="font-semibold max-md:hidden">Create</span>
          </DialogTrigger>
        }
      />

      <Link
        href={'/'}
        className={cn(
          'hidden items-center gap-2 text-muted-foreground hover:cursor-pointer hover:text-primary sm:flex',
        )}
      >
        <Icons.BellIcon className="stroke-2" />
        <span className="font-semibold max-md:hidden">Notifications</span>
      </Link>

      <Link
        href={'/my/messages'}
        className={cn(
          'items-center gap-2 hover:cursor-pointer hover:text-primary sm:flex',
          pathname != '/my/messages' && 'text-muted-foreground',
        )}
      >
        <Icons.MessageCircleIcon className="stroke-2" />
        <span className="font-semibold max-md:hidden">Messages</span>
      </Link>

      <Link
        href={`/${user?.username}`}
        className={cn(
          'hidden items-center gap-2 hover:cursor-pointer hover:text-primary sm:flex',
          pathname != `/${user?.username}` && 'text-muted-foreground',
        )}
      >
        <Icons.CircleUserIcon className="stroke-2" />
        <span className="font-semibold max-md:hidden">Profile</span>
      </Link>

      <div className="sm:hidden">
        {user ? (
          <UserDropdownMenu
            triggerChildren={<UserAvatar user={user} className="h-8 w-8" />}
          ></UserDropdownMenu>
        ) : (
          <Skeleton className="h-8 w-8 rounded-full" />
        )}
      </div>
    </nav>
  );
}
