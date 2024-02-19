import { PostsList } from '@/components/posts/posts-list';
import { Icons } from '@/components/ui/icons';

import { UserProfileContent } from './user-profile-content';
import { UserProfileHeader } from './user-profile-header';
import { useUserProfileContext } from './user-profile-provider';

export function UserProfile() {
  const { userProfile } = useUserProfileContext();

  return (
    <div
      className="flex flex-1 flex-col overflow-y-scroll"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="sticky top-0 z-50 flex min-h-fit flex-col border-b-2 px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div>
            <Icons.ArrowLeftIcon className="h-5 w-5" />
          </div>
          <div className="flex flex-1 items-center gap-2">
            <p className="text-xl font-bold">{userProfile.displayName}</p>
            <Icons.BadgeCheckIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      <UserProfileHeader />

      <PostsList userId={userProfile._id} />
    </div>
  );
}
