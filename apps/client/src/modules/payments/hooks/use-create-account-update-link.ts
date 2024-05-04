import { useMutation } from '@tanstack/react-query';

import { api } from '@/common/libs/apis';

export function useCreateAccountUpdateLink() {
  return useMutation({
    mutationFn: async (): Promise<{ url: string }> => {
      const response = await api.post('payments/create-account-update-link');
      return response.data;
    },
  });
}
