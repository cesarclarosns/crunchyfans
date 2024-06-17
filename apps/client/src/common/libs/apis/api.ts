import axios, { AxiosError, HttpStatusCode } from 'axios';
import axiosRetry from 'axios-retry';
import { Cookies } from 'react-cookie';

import { AUTH_COOKIES } from '@/common/constants/cookies';
import { env } from '@/env';
import { refresh } from '@/modules/auth/libs/refresh';

const cookies = new Cookies();

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
  (req) => {
    const isUserAuthenticated = cookies.get(AUTH_COOKIES.isUserAuthenticated);

    if (isUserAuthenticated && !req.headers.Authorization) {
      const accessToken = cookies.get(AUTH_COOKIES.accessToken);
      req.headers.Authorization = `Bearer ${accessToken}`;
    }

    return req;
  },
  (err) => Promise.reject(err),
);

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const isUserAuthenticated = cookies.get(AUTH_COOKIES.isUserAuthenticated);

    if (isUserAuthenticated && err instanceof AxiosError) {
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
