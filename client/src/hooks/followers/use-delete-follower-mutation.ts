import { useMutation } from '@tanstack/react-query';

import { type DeleteFollower } from '@/common/schemas/followers/delete-follower';
import { api } from '@/libs/apis';

export function useDeleteFollowerMutation() {
  return useMutation({
    mutationFn: async (data: DeleteFollower) => {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('followerId', data.followerId);
      urlSearchParams.set('followeeId', data.followeeId);

      const response = await api.delete('followers');
      return response.data;
    },
  });
}
