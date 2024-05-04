import { useMutation } from '@tanstack/react-query';

import { api } from '@/common/libs/apis';
import { type Media } from '@/modules/media/schemas/media';

export function useCreateMediaMutation() {
  return useMutation({
    mutationFn: async (data: {
      fileKey: string;
      needsThumbnail: boolean;
      needsWatermark: boolean;
      watermarkText?: string;
    }): Promise<Media> => {
      const response = await api.post('media', data);
      return response.data;
    },
    mutationKey: [],
  });
}
