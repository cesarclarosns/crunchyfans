import { publicApi } from '@/libs/apis';
import { type ResetPassword } from '@/schemas/auth/reset-password';

export async function resetPassword(data: ResetPassword) {
  await publicApi.post('auth/reset-password', data);
}
