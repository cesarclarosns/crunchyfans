'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/modules/ui/components/dropdown-menu';
import { signOut } from '@/modules/auth/libs/sign-out';
import { useGetCurrentUserQuery } from '@/modules/users/hooks/use-get-current-user-query';

import { Icons } from '../../modules/ui/components/icons';

export type UserDropdownMenuProps = {
  triggerChildren: React.ReactNode;
};

export function UserDropdownMenu({ triggerChildren }: UserDropdownMenuProps) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { data: user } = useGetCurrentUserQuery();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{triggerChildren}</DropdownMenuTrigger>
      <DropdownMenuContent onCloseAutoFocus={(ev) => ev.preventDefault()}>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="gap-2"
            onClick={() => router.push(`/${user?.username}`)}
          >
            <Icons.CircleUserIcon className="h-5 w-5" />
            My profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2"
            onClick={() => router.push('/my/settings')}
          >
            <Icons.Settings className="h-5 w-5" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2">
            <Icons.HelpCircleIcon className="h-5 w-5" />
            Help and support
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <Icons.SunMoonIcon className="h-5 w-5" />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                className="gap-2"
                onClick={(ev) => {
                  setTheme('light');
                  ev.preventDefault();
                }}
              >
                <Icons.SunIcon className="h-5 w-5" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2"
                onClick={(ev) => {
                  setTheme('dark');
                  ev.preventDefault();
                }}
              >
                <Icons.MoonStarIcon className="h-5 w-5" />
                Dark
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="gap-2"
            onClick={() => router.push('/my/payments/cards')}
          >
            <Icons.CreditCardIcon className="h-5 w-5" />
            <span>
              Your cards{' '}
              <span className="text-muted-foreground">(to subscribe)</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2"
            onClick={() => router.push('/my/payments/bank_accounts')}
          >
            <Icons.LandmarkIcon className="h-5 w-5" />
            <span>
              Your bank accounts{' '}
              <span className="text-muted-foreground">(to earn)</span>
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2" onClick={signOut}>
            <Icons.LogOutIcon className="h-5 w-5" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
