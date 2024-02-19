import { useMutation } from '@tanstack/react-query';
import axios, { type AxiosRequestConfig } from 'axios';

import { api, publicApi } from '@/libs/apis';

export function useUploadMutations() {
  const createUploadSignedUrlMutation = useMutation({
    mutationFn: async ({
      fileKey,
      signal,
    }: {
      fileKey: string;
      signal: AxiosRequestConfig['signal'];
    }): Promise<{ url: string }> => {
      const urlSerchParams = new URLSearchParams();
      urlSerchParams.set('fileKey', fileKey);

      const response = await api.post(
        'media/upload?' + urlSerchParams.toString(),
        {},
        { signal },
      );
      return response.data;
    },
    retry: (failureCount, error) => {
      if (axios.isCancel(error)) return false;
      return true;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({
      url,
      file,
      signal,
      onUploadProgress,
    }: {
      url: string;
      file: File;
      signal: AxiosRequestConfig['signal'];
      onUploadProgress: AxiosRequestConfig['onUploadProgress'];
    }) => {
      await publicApi.put(url, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress,
        signal,
      });
    },
    retry: (failureCount, error) => {
      if (axios.isCancel(error)) return false;
      return true;
    },
  });

  return { createUploadSignedUrlMutation, uploadMutation };
}
