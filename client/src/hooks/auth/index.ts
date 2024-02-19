import { AxiosError, HttpStatusCode } from 'axios';
import { useRouter } from 'next/navigation';
import { Cookies } from 'react-cookie';
import { z } from 'zod';

import { AUTH_COOKIES } from '@/common/constants/cookies';
import { type SignIn } from '@/common/schemas/auth/sign-in';
import { type SignUp } from '@/common/schemas/auth/sign-up';
import { privateApi, publicApi } from '@/libs/apis';
import { useAuthStore } from '@/stores/auth-store';

const cookies = new Cookies();

const refreshResponseDataSchema = z
  .object({
    accessToken: z.string(),
  })
  .passthrough();

const signInResponseDataSchema = refreshResponseDataSchema;

export function useSignIn() {
  const { setAuth, setIsAuthenticated } = useAuthStore();
  const router = useRouter();

  async function signIn(data: SignIn) {
    const response = await privateApi.post('/auth/sign-in', data);
    const responseData = signInResponseDataSchema.parse(response.data);

    setAuth(responseData);
    setIsAuthenticated(true);

    router.push('/', {});
    router.refresh();
  }

  return { signIn };
}

export function useSignUp() {
  const { setAuth, setIsAuthenticated } = useAuthStore();
  const router = useRouter();

  async function signUp(data: SignUp) {
    const response = await privateApi.post('/auth/sign-up', data);
    const responseData = signInResponseDataSchema.parse(response.data);

    setAuth(responseData);
    setIsAuthenticated(true);

    router.push('/', {});
    router.refresh();
  }

  return { signUp };
}

export async function signOut() {
  useAuthStore.getState().setAuth(null);
  useAuthStore.getState().setIsAuthenticated(false);
  cookies.remove(AUTH_COOKIES.isAuthenticated);

  await privateApi.post('/auth/sign-out');
}

export async function refresh() {
  try {
    const response = await privateApi.get('/auth/refresh');
    const responseData = refreshResponseDataSchema.parse(response.data);

    useAuthStore.getState().setAuth(responseData);
    return responseData;
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

export async function resetPassword(data: { email: string }) {
  const response = await publicApi.post('/auth/reset-password', data);
  return response.data;
}
