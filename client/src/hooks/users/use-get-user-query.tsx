import { useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type User } from '@/schemas/users/user';

export function useGetUserQuery(userId: string) {
  return useQuery({
    enabled: !!userId,
    queryFn: async (): Promise<User> => {
      const response = await api.get(`users/${userId}`);
      return response.data;
    },
    queryKey: [`users/${userId}`],
  });
}
