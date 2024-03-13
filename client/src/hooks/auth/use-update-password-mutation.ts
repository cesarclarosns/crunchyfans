import { useMutation } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type UpdatePassword } from '@/schemas/auth/update-password';

export function useUpdatePasswordMutation() {
  return useMutation({
    mutationFn: async (data: UpdatePassword) => {
      await api.put('auth/password', data);
    },
  });
}
