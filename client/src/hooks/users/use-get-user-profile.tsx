import { useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type UserProfile } from '@/schemas/users/user';

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
