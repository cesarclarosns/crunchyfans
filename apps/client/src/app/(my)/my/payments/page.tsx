'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { Icons } from '@/modules/ui/components/icons';

export default function PaymentsPage() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="flex flex-1 flex-col overflow-y-scroll"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="sticky top-0 z-50 flex h-14 min-h-fit items-center gap-2 border-b-2 px-4 py-2 backdrop-blur-md">
        <div>
          <Icons.ArrowLeftIcon className="h-6 w-6" />
        </div>
        <div className="flex flex-1 items-center gap-2">
          <p className="text-xl font-bold">Add card</p>
        </div>
      </div>
    </div>
  );
}
