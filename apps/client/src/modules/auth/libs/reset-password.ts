import { publicApi } from '@/common/libs/apis';
import { type ResetPassword } from '@/modules/auth/schemas/reset-password';

export async function resetPassword(data: ResetPassword) {
  await publicApi.post('auth/reset-password', data);
}
