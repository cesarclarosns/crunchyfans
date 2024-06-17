import { useQuery } from '@tanstack/react-query';

import { api } from '@/common/libs/apis';
import { type UserProfile } from '@/modules/users/models/user-profile';

export const useGetUserProfile = (username: string) => {
  return useQuery({
    enabled: !!username,
    queryFn: async (): Promise<UserProfile> => {
      const response = await api.get(`users/${username}/profile`);
      return response.data;
    },
    queryKey: [`users/${username}/profile`],
  });
};
