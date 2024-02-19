import { useMutation } from '@tanstack/react-query';

export function useDeletePostMutation() {
  return useMutation({
    mutationFn: async () => {},
  });
}
