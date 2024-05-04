'use client';

import { FeedList } from '@/modules/posts/components/feed-list';
import { Icons } from '@/modules/ui/components/icons';

export default function HomePage() {
  return (
    <div
      className="flex flex-col overflow-y-scroll"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="flex items-center justify-between gap-5 border-b-2 px-4 py-2">
        <p className="text-xl font-bold">Home</p>
        <Icons.Search className="h-5 w-5" />
      </div>

      <FeedList />
    </div>
  );
}
