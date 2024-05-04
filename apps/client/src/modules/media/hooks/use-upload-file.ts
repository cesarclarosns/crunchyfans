import { useMutation } from '@tanstack/react-query';
import axios, { type AxiosRequestConfig } from 'axios';
import { randomUUID } from 'crypto';

export type Upload = {
  file: File;
  progress: number;
  isReady: boolean;
  hasError: boolean;
  mediaId?: string;
  abortController: AbortController;
};

export const useCreateUploadUrl = () => {
  return useMutation({
    mutationFn: async ({
      fileKey,
      signal,
    }: {
      fileKey: string;
      signal?: AbortSignal;
    }): Promise<string> => {
      axios.post('media/uploads');

      const uploadUrl = '';
      return uploadUrl;
    },
    mutationKey: [],
    retry(failureCount, error) {
      return !axios.isCancel(error);
    },
  });
};

export const useUploadFile = () => {
  const createUploadUrl = useCreateUploadUrl();

  const handleMultipartUpload = () => {};
  const handleUpload = () => {};

  return useMutation({
    mutationFn: async ({
      file,
      onUploadProgress,
      signal,
    }: {
      file: File;
      onUploadProgress?: AxiosRequestConfig['onUploadProgress'];
      signal?: AbortSignal;
      options?: {};
    }): Promise<{ mediaId: string }> => {
      const fileKey = randomUUID();

      const uploadUrl = await createUploadUrl.mutateAsync({ fileKey, signal });

      axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress,
        signal,
      });

      return { mediaId: '' };
    },
    mutationKey: [],
    retry(failureCount, error) {
      return !axios.isCancel(error);
    },
  });
};
