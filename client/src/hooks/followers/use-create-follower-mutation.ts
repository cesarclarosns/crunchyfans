import { useMutation } from '@tanstack/react-query';

import { type CreateFollower } from '@/common/schemas/followers/create-follower';
import { api } from '@/libs/apis';
import { type Follower } from '@/schemas/followers/follower';

export function useCreateFollowerMutation() {
  return useMutation({
    mutationFn: async (data: CreateFollower): Promise<Follower> => {
      const response = await api.post('followers', data);
      return response.data;
    },
  });
}
