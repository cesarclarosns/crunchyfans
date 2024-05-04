import axios from 'axios';

import { env } from '@/env';

export const privateApi = axios.create({
  baseURL: `${env.NEXT_PUBLIC_API_DOMAIN}${env.NEXT_PUBLIC_API_PATH}`,
  withCredentials: true,
});
