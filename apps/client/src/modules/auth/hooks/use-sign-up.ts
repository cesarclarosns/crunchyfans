import { useMutation } from '@tanstack/react-query';

import { privateApi } from '@/common/libs/apis';
import { authSchema } from '@/modules/auth/schemas/auth';
import { type SignUp } from '@/modules/auth/schemas/sign-up';

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (data: SignUp) => {
      const response = await privateApi.post('auth/signup', data);
      return await authSchema.parseAsync(response.data);
    },
  });
};
