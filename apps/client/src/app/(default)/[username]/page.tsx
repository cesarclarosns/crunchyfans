'use client';

import { PostsList } from '@/modules/posts/components/posts-list';
import { UserProfile } from '@/components/users/profile/user-profile';
import { UserProfileProvider } from '@/components/users/profile/user-profile-provider';
import { useGetUserProfileQuery } from '@/modules/users/hooks/use-get-user-profile';

export default function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { data: userProfile } = useGetUserProfileQuery(params.username);

  return (
    <div className="flex flex-1 flex-col">
      {userProfile ? (
        <>
          <UserProfileProvider userProfile={userProfile}>
            <UserProfile />
          </UserProfileProvider>
        </>
      ) : (
        <>
          <p>Loading...</p>
        </>
      )}
    </div>
  );
}
