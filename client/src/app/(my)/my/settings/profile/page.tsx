'use client';

import { useRouter } from 'next/navigation';

import { Icons } from '@/components/ui/icons';
import { EditUserProfileForm } from '@/components/users/forms/edit-user-profile-form';
import { EditUserUsernameForm } from '@/components/users/forms/edit-user-username-form';
import { useGetCurrentUserQuery } from '@/hooks/users/use-get-current-user-query';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { data: user } = useGetCurrentUserQuery();

  return (
    <div className="flex min-h-fit flex-1 flex-col">
      <div className="flex h-14 items-center gap-2 border-b-2 px-2 py-1">
        <div>
          <Icons.ArrowLeftIcon
            className="h-6 w-6 hover:cursor-pointer"
            onClick={() => router.back()}
          />
        </div>
        <div>
          <p className="text-xl font-bold">Change profile</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        {!!user && <EditUserProfileForm user={user} />}
      </div>
    </div>
  );
}
