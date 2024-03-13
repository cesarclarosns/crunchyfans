'use client';

import { useRouter } from 'next/navigation';

import { Icons } from '@/components/ui/icons';
import { EditUserEmailForm } from '@/components/users/forms/edit-user-email-form';
import { useGetCurrentUserQuery } from '@/hooks/users/use-get-current-user-query';

export default function EmailSettingsPage() {
  const router = useRouter();
  const { data: user } = useGetCurrentUserQuery();

  return (
    <div className="flex min-h-fit flex-1 flex-col">
      <div className="flex h-14 items-center gap-2 border-b-2 px-2 py-1">
        <div>
          <Icons.ArrowLeftIcon
            className="h-6 w-6 hover:cursor-pointer"
            onClick={() => router.push('/my/settings/account')}
          />
        </div>
        <div>
          <p className="text-xl font-bold">Change email</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        {!!user && <EditUserEmailForm user={user} />}
      </div>
    </div>
  );
}
