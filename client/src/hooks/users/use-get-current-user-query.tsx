import { useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type User } from '@/models/users/user';

export function useGetCurrentUserQuery() {
  return useQuery({
    gcTime: Infinity,
    queryFn: async (): Promise<User> => {
      const response = await api.get('users/me');
      return response.data;
    },
    queryKey: ['users', 'me'],
    staleTime: Infinity,
  });
}
