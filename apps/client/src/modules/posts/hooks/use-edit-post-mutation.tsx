import { useMutation } from '@tanstack/react-query';

export function useEditPostMutation() {
  return useMutation({
    mutationFn: async () => {},
  });
}
