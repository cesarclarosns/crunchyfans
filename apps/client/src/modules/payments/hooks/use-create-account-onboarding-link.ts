import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/common/libs/apis';

const dataSchema = z.object({ url: z.string() });

export function useCreateAccountOnboardingLink() {
  return useMutation({
    mutationFn: async (): Promise<{ url: string }> => {
      const response = await api.post(
        'payments/create-account-onboarding-link',
      );
      return dataSchema.parse(response.data);
    },
  });
}
