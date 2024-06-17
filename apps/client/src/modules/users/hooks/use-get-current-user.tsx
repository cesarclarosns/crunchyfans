import { useQuery } from '@tanstack/react-query';

import { api } from '@/common/libs/apis';
import { type User } from '@/modules/users/schemas/user';

import { usersKeys } from './users-keys';

export const useGetCurrentUser = () => {
  return useQuery({
    gcTime: Infinity,
    queryFn: async (): Promise<User> => {
      const response = await api.get('users/me');
      return response.data;
    },
    queryKey: usersKeys.me(),
    staleTime: Infinity,
  });
};
