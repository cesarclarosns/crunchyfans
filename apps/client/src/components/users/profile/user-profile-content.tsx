import { useUserProfileContext } from './user-profile-provider';

export function UserProfileContent() {
  const { userProfile } = useUserProfileContext();

  return <div className="flex flex-col"></div>;
}
