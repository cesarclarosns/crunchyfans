import { useRouter } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useCreateChatMutation } from '@/hooks/chats/use-create-chat-mutation';
import { useGetCurrentUserQuery } from '@/hooks/users';
import { useUsersStatus } from '@/hooks/users/use-users-status';
import { useAuthStore } from '@/stores/auth-store';
import { useChatsStore } from '@/stores/chats-store';

import { UserAvatar } from '../user-avatar';
import { useUserProfileContext } from './user-profile-provider';

export function UserProfileHeader() {
  const { isAuthenticated } = useAuthStore((state) => state);

  return (
    <div className="flex min-h-fit flex-col gap-5 border-b-2 px-4 py-10">
      {isAuthenticated ? (
        <>
          <Description />
          <Actions />
        </>
      ) : (
        <>
          <PublicDescription />
          <PublicActions />
        </>
      )}
    </div>
  );
}

export function Description() {
  const { userProfile } = useUserProfileContext();
  const { usersStatus } = useUsersStatus([userProfile._id]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        <div className="relative w-fit">
          <UserAvatar
            user={userProfile}
            className="h-24 w-24 text-2xl sm:h-24 sm:w-24"
          />
          <div className="absolute bottom-5 right-0">
            <span className="relative flex h-3 w-3">
              {usersStatus.online.includes(userProfile._id) ? (
                <>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-600"></span>
                </>
              ) : (
                <>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-slate-400"></span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="">
          <div className="flex items-center gap-1 font-semibold">
            <p className="text-xl font-bold">{userProfile.displayName}</p>
            <Icons.BadgeCheckIcon className="h-5 w-5"></Icons.BadgeCheckIcon>
          </div>

          <p className="text-sm">
            <span>@{userProfile.username}</span>
            {usersStatus.online.includes(userProfile._id) && (
              <span className="pl-2">Available now</span>
            )}
          </p>

          <p className="pt-2 text-sm text-muted-foreground">
            <span>
              {userProfile.metadata?.followersCount ?? '0'}{' '}
              {userProfile.metadata?.followersCount === 1
                ? 'Follower'
                : 'Followers'}
            </span>
            <span className="pl-2">
              {userProfile.metadata?.followeesCount ?? '0'}{' '}
              {userProfile.metadata?.followeesCount === 1
                ? 'Followee'
                : 'Followees'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function PublicDescription() {
  const { userProfile } = useUserProfileContext();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        <div className="relative w-fit">
          <UserAvatar
            user={userProfile}
            className="h-24 w-24 text-2xl sm:h-24 sm:w-24"
          />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="">
          <div className="flex items-center gap-1 font-semibold">
            {userProfile.displayName}
            <Icons.BadgeCheckIcon className="h-5 w-5"></Icons.BadgeCheckIcon>
          </div>

          <p className="pt-2 text-sm text-muted-foreground">
            <span>
              {userProfile.metadata?.followersCount ?? '0'}{' '}
              {userProfile.metadata?.followersCount === 1
                ? 'Follower'
                : 'Followers'}
            </span>
            <span className="pl-2">
              {userProfile.metadata?.followeesCount ?? '0'}{' '}
              {userProfile.metadata?.followeesCount === 1
                ? 'Followee'
                : 'Followees'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function Actions() {
  const router = useRouter();
  const { data: currentUser } = useGetCurrentUserQuery();

  const { userProfile } = useUserProfileContext();

  const { setChatId } = useChatsStore((state) => state);
  const createChatMutation = useCreateChatMutation();
  const handleSendMessage = async () => {
    try {
      const chat = await createChatMutation.mutateAsync({
        participants: [currentUser!._id, userProfile._id],
      });
      setChatId(chat._id);
      router.push('/my/messages');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {currentUser?._id === userProfile._id ? (
        <div className="flex flex-col">
          <Button
            className="h-fit"
            onClick={() => router.push('/my/settings/profile')}
          >
            Edit profile
          </Button>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          <Button className="h-fit flex-1">
            {userProfile.isFollowing ? 'Following' : 'Follow'}
          </Button>
          <Button
            variant={'secondary'}
            className="h-fit flex-1"
            onClick={handleSendMessage}
          >
            Message
          </Button>
        </div>
      )}
    </>
  );
}

export function PublicActions() {
  return (
    <div className="flex gap-2">
      <Button className="h-fit flex-1">Follow</Button>
      <Button variant={'secondary'} className="h-fit flex-1">
        Message
      </Button>
    </div>
  );
}
