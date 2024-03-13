import Link from 'next/link';

import { CreatePostForm } from '@/components/posts/forms/create-post-form';
import { Icons } from '@/components/ui/icons';

export default function CreatePage() {
  return (
    <div
      className="flex flex-1 flex-col overflow-y-scroll"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="sticky top-0 z-50 flex h-14 min-h-fit items-center gap-2 border-b-2 px-4 py-2 backdrop-blur-md">
        <Link href={'/'}>
          <Icons.ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <div className="flex flex-1 items-center gap-2">
          <p className="text-xl font-bold">Create post</p>
        </div>
      </div>

      <div className="min-h-fit px-4 py-5">
        <CreatePostForm />
      </div>
    </div>
  );
}
