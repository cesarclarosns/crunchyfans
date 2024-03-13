import { useMutation } from '@tanstack/react-query';

import { api } from '@/libs/apis';
import { type Media } from '@/schemas/media/media';

export function useCreateMediaMutation() {
  return useMutation({
    mutationFn: async (data: {
      fileKey: string;
      watermarkText?: string;
    }): Promise<Media> => {
      const response = await api.post('media', data);
      return response.data;
    },
    mutationKey: [],
  });
}
