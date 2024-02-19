import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type TUser } from '@/models/users/user';

export function useUpdateUserMutation(id: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<TUser>): Promise<TUser> => {
      const response = await api.patch(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
}
