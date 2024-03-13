import { Cookies } from 'react-cookie';

import { AUTH_COOKIES } from '@/common/constants/cookies';
import { privateApi } from '@/libs/apis';
import { useAuthStore } from '@/stores/auth-store';

const cookies = new Cookies();

export async function signOut() {
  useAuthStore.getState().setAuth(null);
  useAuthStore.getState().setIsAuthenticated(false);
  cookies.remove(AUTH_COOKIES.isAuthenticated);

  await privateApi.post('auth/sign-out');
}
