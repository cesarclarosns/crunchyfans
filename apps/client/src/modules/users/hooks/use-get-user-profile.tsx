import { useQuery } from '@tanstack/react-query';

import { api } from '@/common/libs/apis';
import { type UserProfile } from '@/modules/users/schemas/user';

export function useGetUserProfileQuery(username: string | null) {
  return useQuery({
    enabled: !!username,
    queryFn: async (): Promise<UserProfile> => {
      const response = await api.get(`users/${username}/profile`);
      return response.data;
    },
    queryKey: [`users/${username}/profile`],
  });
}
