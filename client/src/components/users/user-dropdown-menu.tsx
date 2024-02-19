'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/hooks/auth';

import { ThemeDropdownMenu } from '../theme-dropdown-menu';
import { Icons } from '../ui/icons';
import { UserSettingsSheet } from './settings/user-settings-sheet';

export type UserDropdownMenuProps = {
  triggerChildren: React.ReactNode;
};

export function UserDropdownMenu({ triggerChildren }: UserDropdownMenuProps) {
  const { setTheme } = useTheme();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{triggerChildren}</DropdownMenuTrigger>
      <DropdownMenuContent onCloseAutoFocus={(ev) => ev.preventDefault()}>
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2">
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
          <DropdownMenuItem className="gap-2" onClick={signOut}>
            <Icons.LogOutIcon className="h-5 w-5" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
