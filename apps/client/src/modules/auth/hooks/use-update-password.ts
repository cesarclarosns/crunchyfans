import { useMutation } from '@tanstack/react-query';

import { api } from '@/common/libs/apis';
import { type UpdatePassword } from '@/modules/auth/schemas/update-password';

export function useUpdatePasswordMutation() {
  return useMutation({
    mutationFn: async (data: UpdatePassword) => {
      await api.put('auth/password', data);
    },
  });
}
