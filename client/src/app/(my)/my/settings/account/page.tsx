'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Icons } from '@/components/ui/icons';
import { cn } from '@/libs/utils';

const links = [
  {
    href: '/my/settings/account/username',
    title: 'Username',
  },
  {
    href: '/my/settings/account/email',
    title: 'Email',
  },
  {
    href: '/my/settings/account/password',
    title: 'Password',
  },
];

export default function AccountSettingsPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-fit flex-1 flex-col">
      <div className="flex h-14 items-center gap-2 border-b-2 px-2 py-1">
        <div>
          <Icons.ArrowLeftIcon
            className="h-6 w-6 hover:cursor-pointer"
            onClick={() => router.back()}
          />
        </div>
        <div>
          <p className="text-xl font-bold">Account</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        {links.map(({ title, href }) => (
          <Link
            href={href}
            className={cn(
              'flex items-center justify-between truncate border-b-2 px-4 py-3 hover:bg-secondary',
            )}
          >
            <span className="truncate">{title}</span>
            <div className="min-w-fit">
              <Icons.ChevronRightIcon className="h-5 w-5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
