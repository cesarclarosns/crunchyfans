'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Icons } from '@/components/ui/icons';
import { cn } from '@/libs/utils';

const links = [
  {
    href: '/my/settings/profile',
    title: 'Profile',
  },
  {
    href: '/my/settings/account',
    title: 'Account',
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex min-h-fit flex-1">
      <div className="flex basis-1/2 flex-col border-x-2">
        <div className="flex h-14 items-center gap-2 border-b-2 px-2 py-1">
          <div>
            <Icons.ArrowLeftIcon
              className="h-6 w-6 hover:cursor-pointer"
              onClick={() => router.back()}
            />
          </div>
          <div>
            <p className="text-xl font-bold">Settings</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {links.map(({ title, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center justify-between truncate border-b-2 px-4 py-3 hover:bg-secondary',
                pathname.startsWith(href) && 'bg-secondary',
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

      <div className="flex basis-1/2 flex-col border-r-[1px]">{children}</div>
    </div>
  );
}
