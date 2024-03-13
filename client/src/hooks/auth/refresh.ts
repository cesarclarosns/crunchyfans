import { AxiosError, HttpStatusCode } from 'axios';

import { privateApi } from '@/libs/apis';
import { authSchema } from '@/schemas/auth/auth';
import { useAuthStore } from '@/stores/auth-store';

import { signOut } from './sign-out';

export async function refresh() {
  try {
    const response = await privateApi.get('auth/refresh');
    const auth = await authSchema.parseAsync(response.data);
    useAuthStore.getState().setAuth(auth);
    return auth;
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.response?.status === HttpStatusCode.Unauthorized
    ) {
      await signOut();
    }

    throw error;
  }
}
