'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Icons } from '@/modules/ui/components/icons';
import { cn } from '@/modules/ui/libs/utils';

const links = [
  { href: '/my/payments/list', title: 'Your payments' },
  { href: '/my/payments/bank_account', title: 'Your bank account' },
  { href: '/my/payments/balance', title: 'Your balance' },
  { href: '/my/payments/cards', title: 'Your cards' },
  { href: '/my/payments/add_card', title: 'Add card' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-1">
      <div className="flex basis-1/3 flex-col border-x-2">
        <div className="flex h-14 items-center gap-2 border-b-2 px-2 py-2">
          <div>
            <Icons.ArrowLeftIcon
              className="h-6 w-6 hover:cursor-pointer"
              onClick={() => router.back()}
            />
          </div>
          <div>
            <p className="text-xl font-bold">Payments</p>
          </div>
        </div>

        <div className="flex flex-col">
          {links.map(({ title, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center justify-between truncate border-b-2 px-4 py-3 hover:bg-secondary',
                pathname === href && 'bg-secondary',
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

      <div className="flex basis-2/3 flex-col border-r-2">{children}</div>
    </div>
  );
}
