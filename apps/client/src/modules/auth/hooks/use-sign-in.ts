import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { privateApi } from '@/common/libs/apis';
import { authSchema } from '@/modules/auth/schemas/auth';
import { type SignIn } from '@/modules/auth/schemas/sign-in';

export const useSignIn = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignIn) => {
      const response = await privateApi.post('auth/signin', data);
      return await authSchema.parseAsync(response.data);
    },
    onSuccess() {
      router.push('/');
      router.refresh();
    },
  });
};
