import { useMutation, useQuery } from '@tanstack/react-query';

import { api } from '@/libs/apis';

export function useCreateSetupIntent() {
  return useMutation({
    mutationFn: async (): Promise<{ clientSecret: string }> => {
      const response = await api.post('payments/create-setup-intent');
      return response.data;
    },
  });
}
