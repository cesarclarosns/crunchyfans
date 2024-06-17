import { useRouter } from 'next/navigation';

import { PostsList } from '@/modules/posts/components/posts-list';
import { Icons } from '@/modules/ui/components/icons';

import { UserProfileHeader } from './user-profile-header';
import { useUserProfileContext } from './user-profile-provider';

export function UserProfile() {
  const router = useRouter();
  const { userProfile } = useUserProfileContext();

  return (
    <div
      className="flex flex-1 flex-col overflow-y-scroll"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="sticky top-0 z-50 flex h-14 min-h-fit items-center gap-2 border-b-2 px-4 py-2 backdrop-blur-md">
        <div>
          <Icons.ArrowLeftIcon
            className="h-6 w-6 hover:cursor-pointer"
            onClick={() => router.back()}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-1 items-center gap-2">
            <p className="text-xl font-bold">{userProfile.displayName}</p>
            <Icons.BadgeCheckIcon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Icons.UserRoundPlusIcon className="h-4 w-4" />
              <span className="text-sm">199k</span>
            </div>

            <div className="flex items-center gap-1">
              <Icons.UserRoundPlusIcon className="h-4 w-4" />
              <span className="text-sm">199k</span>
            </div>
          </div>
        </div>
      </div>

      <UserProfileHeader />

      <PostsList userId={userProfile._id} />
    </div>
  );
}
