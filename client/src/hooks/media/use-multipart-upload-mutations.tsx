import { useMutation } from '@tanstack/react-query';
import axios, { type AxiosRequestConfig } from 'axios';

import { api, publicApi } from '@/libs/apis';

export function useMultipartUploadMutations() {
  const createUploadPartSignedUrlMutation = useMutation({
    mutationFn: async ({
      fileKey,
      partNumber,
      uploadId,
      signal,
    }: {
      fileKey: string;
      partNumber: number;
      uploadId: string;
      signal: AxiosRequestConfig['signal'];
    }): Promise<{ url: string }> => {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('fileKey', fileKey);
      urlSearchParams.set('uploadId', uploadId);
      urlSearchParams.set('partNumber', partNumber.toString());

      const response = await api.post(
        'media/multipart-upload?' + urlSearchParams.toString(),
        {},
        {
          signal,
        },
      );
      return response.data;
    },
    retry: (failureCount, error) => {
      if (axios.isCancel(error)) return false;
      return true;
    },
  });

  const createMultipartUploadMutation = useMutation({
    mutationFn: async ({
      fileKey,
      uploads,
      signal,
    }: {
      fileKey: string;
      uploads: string;
      signal: AxiosRequestConfig['signal'];
    }): Promise<{ UploadId: string }> => {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('fileKey', fileKey);
      urlSearchParams.set('uploads', uploads);

      const response = await api.post(
        'media/multipart-upload?' + urlSearchParams.toString(),
        {},
        {
          signal,
        },
      );
      return response.data;
    },
    retry: (failureCount, error) => {
      return !axios.isCancel(error);
    },
  });

  const uploadPartMutation = useMutation({
    mutationFn: async ({
      url,
      file,
      blob,
      onUploadProgress,
      signal,
    }: {
      url: string;
      blob: Blob;
      file: File;
      onUploadProgress: AxiosRequestConfig['onUploadProgress'];
      signal: AxiosRequestConfig['signal'];
    }) => {
      const response = await publicApi.put(url, blob, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress,
        signal,
      });

      const etag = response.headers['etag'] as string;
      if (!etag) throw new Error('etag not found in headers');

      return { etag };
    },
    retry: (failureCount, error) => {
      return !axios.isCancel(error);
    },
  });

  const completeMultipartUploadMutation = useMutation({
    mutationFn: async ({
      parts,
      fileKey,
      uploadId,
      signal,
    }: {
      parts: { etag: string; partNumber: number }[];
      fileKey: string;
      uploadId: string;
      signal: AxiosRequestConfig['signal'];
    }): Promise<{ ETag: string }> => {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('fileKey', fileKey);
      urlSearchParams.set('uploadId', uploadId);

      const response = await api.post(
        'media/multipart-upload?' + urlSearchParams.toString(),
        { parts },
        {
          signal,
        },
      );
      return response.data;
    },
    retry: (failureCount, error) => {
      return !axios.isCancel(error);
    },
  });

  const abortMultipartUploadMutation = useMutation({
    mutationFn: async ({
      fileKey,
      uploadId,
      signal,
    }: {
      fileKey: string;
      uploadId: string;
      signal: AxiosRequestConfig['signal'];
    }) => {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('fileKey', fileKey);
      urlSearchParams.set('uploadId', uploadId);

      const response = await api.delete(
        'media/multipart-upload?' + urlSearchParams.toString(),
        {
          signal,
        },
      );

      return response.data;
    },
    retry: (failureCount, error) => {
      return !axios.isCancel(error);
    },
  });

  return {
    abortMultipartUploadMutation,
    completeMultipartUploadMutation,
    createMultipartUploadMutation,
    createUploadPartSignedUrlMutation,
    uploadPartMutation,
  };
}
