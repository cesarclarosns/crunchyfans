import axios, { AxiosError, HttpStatusCode } from 'axios';
import axiosRetry from 'axios-retry';

import { env } from '@/env';
import { refresh } from '@/hooks/auth';
import { useAuthStore } from '@/stores/auth-store';

const api = axios.create({
  baseURL: `${env.NEXT_PUBLIC_API_DOMAIN}${env.NEXT_PUBLIC_API_PATH}`,
});

axiosRetry(api, {
  retries: Infinity,
  retryDelay: (retryCount, error) => {
    if (
      [
        HttpStatusCode.TooManyRequests,
        HttpStatusCode.InternalServerError,
      ].includes(error.response?.status!)
    ) {
      const delay = axiosRetry.exponentialDelay(retryCount);
      if (delay > 30_000) return 30_000;
      return delay;
    } else {
      return 1_000;
    }
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
