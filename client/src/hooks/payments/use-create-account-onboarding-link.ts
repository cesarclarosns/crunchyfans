import { useMutation } from '@tanstack/react-query';

import { api } from '@/libs/apis';

export function useCreateAccountOnboardingLink() {
  return useMutation({
    mutationFn: async (): Promise<{ url: string }> => {
      const response = await api.post(
        'payments/create-account-onboarding-link',
      );
      return response.data;
    },
  });
}
