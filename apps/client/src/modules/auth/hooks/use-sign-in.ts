import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { privateApi } from '@/common/libs/apis';
import { authSchema } from '@/modules/auth/schemas/auth';
import { type SignIn } from '@/modules/auth/schemas/sign-in';
import { useAuthStore } from '@/modules/auth/stores/auth-store';

export function useSignInMutation() {
  const { setAuth, setIsAuthenticated } = useAuthStore((state) => state);
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignIn) => {
      const response = await privateApi.post('auth/sign-in', data);
      return await authSchema.parseAsync(response.data);
    },
    onSuccess(data) {
      setAuth(data);
      setIsAuthenticated(true);

      router.push('/');
      router.refresh();
    },
  });
}
