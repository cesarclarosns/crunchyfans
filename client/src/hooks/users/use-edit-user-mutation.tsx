import { useMutation } from '@tanstack/react-query';

export function useEditUserMutation() {
  return useMutation({
    mutationFn: async (data) => {},
    mutationKey: [],
  });
}
