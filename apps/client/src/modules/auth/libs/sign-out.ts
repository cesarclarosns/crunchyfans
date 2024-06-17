import { Cookies } from 'react-cookie';

import { AUTH_COOKIES } from '@/common/constants/cookies';
import { privateApi } from '@/common/libs/apis';

const cookies = new Cookies();

export async function signOut() {
  cookies.remove(AUTH_COOKIES.isUserAuthenticated);

  await privateApi.post('auth/signout');
}
