import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { privateApi } from '@/libs/apis';
import { authSchema } from '@/schemas/auth/auth';
import { type SignIn } from '@/schemas/auth/sign-in';
import { useAuthStore } from '@/stores/auth-store';

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
