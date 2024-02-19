import Link from 'next/link';

import { Icons } from '@/components/ui/icons';
import { Separator } from '@/components/ui/separator';

const items = [
  {
    href: '/my/settings/account',
    title: 'Your account',
  },
  {
    href: '/my/settings/account',
    title: 'Accesibility, display and languages',
  },
  {
    href: '/my/settings/account',
    title: 'Help center',
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="flex basis-1/2 flex-col gap-5 border-x-[1px]">
        <div className="px-4 py-2">
          <p className="text-xl font-bold">Settings</p>
        </div>

        <div className="flex flex-col gap-2">
          {items.map(({ title, href }) => (
            <Link
              href={href}
              className="flex items-center justify-between truncate px-4 py-3 hover:bg-secondary"
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
