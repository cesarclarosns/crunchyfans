import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { privateApi } from '@/libs/apis';
import { authSchema } from '@/schemas/auth/auth';
import { type SignUp } from '@/schemas/auth/sign-up';
import { useAuthStore } from '@/stores/auth-store';

export function useSignUpMutation() {
  const { setAuth, setIsAuthenticated } = useAuthStore((state) => state);
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignUp) => {
      const response = await privateApi.post('auth/sign-up', data);
      return await authSchema.parseAsync(response.data);
    },
    onSuccess: (data) => {
      setAuth(data);
      setIsAuthenticated(true);

      router.push('/');
      router.refresh();
    },
  });
}
