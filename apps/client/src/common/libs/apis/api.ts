import axios, { AxiosError, HttpStatusCode } from 'axios';
import axiosRetry from 'axios-retry';

import { env } from '@/env';
import { refresh } from '@/modules/auth/libs/refresh';
import { useAuthStore } from '@/modules/auth/stores/auth-store';

const api = axios.create({
  baseURL: `${env.NEXT_PUBLIC_API_DOMAIN}${env.NEXT_PUBLIC_API_PATH}`,
});

axiosRetry(api, {
  retries: Infinity,
  retryCondition: (error) => {
    return (
      error instanceof AxiosError &&
      (axiosRetry.isRetryableError(error) ||
        [HttpStatusCode.TooManyRequests].includes(error.response?.status!))
    );
  },
  retryDelay: (retryCount) => {
    const delay = axiosRetry.exponentialDelay(retryCount);
    if (delay > 30_000) return 30_000;
    return delay;
  },
});

let refreshTokenPromise: Promise<string> | undefined;

api.interceptors.request.use(
  (reqConfig) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (isAuthenticated && !reqConfig.headers.Authorization) {
      const accessToken = useAuthStore.getState().auth?.accessToken;
      reqConfig.headers.Authorization = `Bearer ${accessToken}`;
    }

    return reqConfig;
  },
  (err) => Promise.reject(err),
);

api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (isAuthenticated && err instanceof AxiosError) {
      const prevRequest = err.config!;

      if (err.config && err.response?.status === HttpStatusCode.Unauthorized) {
        if (!refreshTokenPromise) {
          refreshTokenPromise = refresh().then(({ accessToken }) => {
            refreshTokenPromise = undefined;
            return accessToken;
          });
        }

        return refreshTokenPromise.then((token) => {
          prevRequest.headers.Authorization = `Bearer ${token}`;
          return api(prevRequest);
        });
      }
    }

    return Promise.reject(err);
  },
);

export { api };
