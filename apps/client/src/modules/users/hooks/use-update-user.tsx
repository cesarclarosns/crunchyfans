import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/common/libs/apis';
import { type UpdateProfile } from '@/modules/users/schemas/update-profile';
import { type User } from '@/modules/users/schemas/user';

import { useCurrentUserData } from './use-get-current-user';
import { usersKeys } from './users-keys';

export function useUpdateUser() {
  const client = useQueryClient();
  const { data: user } = useCurrentUserData();

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
