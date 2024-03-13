import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type UpdateProfile } from '@/schemas/users/update-profile';
import { type User } from '@/schemas/users/user';

import { useGetCurrentUserQuery } from './use-get-current-user-query';
import { usersKeys } from './users-keys';

export function useUpdateUserMutation() {
  const client = useQueryClient();
  const { data: user } = useGetCurrentUserQuery();

  return useMutation({
    mutationFn: async (data: UpdateProfile): Promise<User> => {
      const response = await api.patch(`users/${user?._id}`, data);
      return response.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: usersKeys.me() });
    },
  });
}
