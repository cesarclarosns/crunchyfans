import { useMemo } from 'react';

import { useGetFolloweesQuery } from '@/hooks/followers/use-get-followees-query';

interface UserFolloweesListProps {
  userId: string;
}

export function UserFolloweesList({ userId }: UserFolloweesListProps) {
  const { data } = useGetFolloweesQuery(userId);

  const followers = useMemo(() => data?.pages?.flat(2) ?? [], [data]);

  return (
    <div className="flex flex-col gap-5">
      <p>List of followees: {userId}</p>
      {followers.map(({ followee }) => (
        <div>@{followee.username}</div>
      ))}
    </div>
  );
}
