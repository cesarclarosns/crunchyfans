import { useMemo } from 'react';

import { useGetFollowersQuery } from '@/hooks/followers/use-get-followers-query';

interface UserFollowersListProps {
  userId: string;
}

export function UserFollowersList({ userId }: UserFollowersListProps) {
  const { data } = useGetFollowersQuery(userId);

  const followers = useMemo(() => data?.pages?.flat(2) ?? [], [data]);

  return (
    <div className="flex flex-col gap-5">
      <p>List of followers: {userId}</p>
      {followers.map(({ follower }) => (
        <div>@{follower.username}</div>
      ))}
    </div>
  );
}
