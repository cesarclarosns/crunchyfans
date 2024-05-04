'use client';

import { Sidebar } from '@/components/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <div className="flex flex-1 flex-col sm:border-x-2">{children}</div>
      <div className="hidden basis-1/3 flex-col sm:flex">
        <Sidebar />
      </div>
    </div>
  );
}
