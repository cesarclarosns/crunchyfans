import { AxiosError, HttpStatusCode } from 'axios';

import { privateApi } from '@/common/libs/apis';
import { signOut } from '@/modules/auth/libs/sign-out';
import { authSchema } from '@/modules/auth/schemas/auth';

export async function refresh() {
  try {
    const response = await privateApi.get('auth/refresh');
    const auth = await authSchema.parseAsync(response.data);
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
