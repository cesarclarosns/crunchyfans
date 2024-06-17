import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';

import { FILE_TYPE } from '@/common/constants/media';
import {
  getChunkSize,
  getFileKey,
  getFilePart,
  getNumberOfParts,
  megabytesToBytes,
} from '@/modules/media/libs';
import { type Media } from '@/modules/media/schemas/media';

import { useGetCurrentUserQuery } from '../../users/hooks/use-get-current-user';
import { useCreateMediaMutation } from './use-create-media';
import { useMultipartUploadMutations } from './use-multipart-upload';
import { useUploadMutations } from './use-upload-mutations';

export type Upload = {
  abortController: AbortController;
  file: File;
  media: Media | null;
  objectUrl: string;
  progress: number;
  progressParts: { partNumber: number; progress: number }[];
  status: 'pending' | 'success' | 'error';
};

export function useUploadMedia(options: {
  needsThumbnail: boolean;
  needsWatermark: boolean;
  watermarkText?: string;
}) {
  const { data: user } = useGetCurrentUserQuery();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [uploadsState, setUploadsState] = useState({
    isError: false,
    isPending: false,
    isSuccess: false,
  });
  const uploadsRef = useRef<Upload[]>([]);
  const accept = useMemo(
    () =>
      Object.values(FILE_TYPE)
        .map((fileType) => `.${fileType}`)
        .join(','),
    [],
  );
  const uploadMutations = useUploadMutations();
  const multipartUploadMutations = useMultipartUploadMutations();
  const createMediaMutation = useCreateMediaMutation();

  async function handleSelectFiles(ev: ChangeEvent<HTMLInputElement>) {
    if (!ev.target.files) return;

    const newFiles = Object.values(ev.target.files!).filter((file) => {
      return (
        uploadsRef.current.findIndex(
          (upload) => upload.file.name === file.name,
        ) === -1
      );
    });

    if (!newFiles.length) return;

    const newUploads: Upload[] = newFiles.map((file) => {
      const chunkSize = getChunkSize(file.size);
      const numberOfParts = getNumberOfParts(file.size, chunkSize);
      const progressParts: Upload['progressParts'] = [
        ...Array(numberOfParts).keys(),
      ].map((i) => ({ partNumber: i + 1, progress: 0 }));

      return {
        abortController: new AbortController(),
        file,
        media: null,
        objectUrl: URL.createObjectURL(file),
        progress: 0,
        progressParts,
        status: 'pending',
      };
    });

    newUploads.forEach((upload) => uploadsRef.current.push(upload));
    setUploads([...uploadsRef.current]);

    await Promise.all(
      newUploads.map(async (upload) => {
        if (upload.file.size > megabytesToBytes(5)) {
          await handleMultipartUpload(upload);
        } else {
          await handleUpload(upload);
        }
      }),
    );
  }

  function handleRemoveUploads() {
    for (const upload of uploadsRef.current) {
      upload.abortController.abort();
    }
    uploadsRef.current = [];
    setUploads([]);
  }

  function handleRemoveUpload(upload: Upload) {
    // console.log('handleRemoveUpload', { upload, uploadsRef });
    let index = uploadsRef.current.findIndex(
      ({ file }) => file.name == upload.file.name,
    );

    if (index !== -1) {
      uploadsRef.current[index]!.abortController.abort();
      uploadsRef.current.splice(index, 1);
      setUploads([...uploadsRef.current]);
    }
  }

  async function handleMultipartUpload(upload: Upload) {
    const file = upload.file;

    let uploadId: string;

    try {
      if (!user) throw new Error('Invalid user');

      const fileKey = getFileKey(file, user._id);

      // Create multipartUpload
      const { UploadId } =
        await multipartUploadMutations.createMultipartUploadMutation.mutateAsync(
          {
            fileKey,
            signal: upload.abortController.signal,
            uploads: '',
          },
        );

      uploadId = UploadId;

      // Upload parts using partUpload signed urls
      const chunkSize = getChunkSize(file.size);
      const parts = await Promise.all(
        upload.progressParts.map(async ({ partNumber }) => {
          const blob = getFilePart(file, partNumber, chunkSize);

          const { url } =
            await multipartUploadMutations.createUploadPartSignedUrlMutation.mutateAsync(
              {
                fileKey,
                partNumber,
                signal: upload.abortController.signal,
                uploadId,
              },
            );

          const { etag } =
            await multipartUploadMutations.uploadPartMutation.mutateAsync({
              blob,
              file,
              onUploadProgress: (progressEvent) => {
                if (!progressEvent.progress) return;

                uploadsRef.current.forEach((upload) => {
                  if (upload.file.name === file.name) {
                    upload.progressParts.forEach((progressPart) => {
                      if (progressPart.partNumber === partNumber)
                        progressPart.progress = progressEvent.progress! * 100;
                    });

                    upload.progress = upload.progressParts.reduce(
                      (acc, progressPart) =>
                        acc +
                        (1 / upload.progressParts.length) *
                          progressPart.progress,
                      0,
                    );
                  }
                });
                setUploads([...uploadsRef.current]);
              },
              signal: upload.abortController.signal,
              url,
            });

          return {
            etag,
            partNumber,
          };
        }),
      );

      // Complete multipart upload
      await multipartUploadMutations.completeMultipartUploadMutation.mutateAsync(
        {
          fileKey,
          parts,
          signal: upload.abortController.signal,
          uploadId,
        },
      );

      // Create media and update upload
      const media = await createMediaMutation.mutateAsync({
        fileKey,
        needsThumbnail: options.needsThumbnail,
        needsWatermark: options.needsWatermark,
      });

      uploadsRef.current.forEach((upload) => {
        if (upload.file.name == file.name) {
          upload.media = media;
          upload.status = 'success';
        }
      });
      setUploads([...uploadsRef.current]);
    } catch (err) {
      console.error(err);

      // Update upload
      uploadsRef.current.forEach((upload) => {
        if (upload.file.name == file.name) {
          upload.status = 'error';
        }
      });
      setUploads([...uploadsRef.current]);
    }
  }

  async function handleUpload(upload: Upload) {
    const file = upload.file;
    try {
      if (!user) throw new Error('Invalid user');

      const fileKey = getFileKey(file, user._id);

      // Upload file
      const { url } =
        await uploadMutations.createUploadSignedUrlMutation.mutateAsync({
          fileKey,
          signal: upload.abortController.signal,
        });

      await uploadMutations.uploadMutation.mutateAsync({
        file,
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.progress) return;

          uploadsRef.current.forEach((upload) => {
            if (upload.file.name === file.name) {
              upload.progress = progressEvent.progress! * 100;
            }
          });
          setUploads([...uploadsRef.current]);
        },
        signal: upload.abortController.signal,
        url,
      });

      // Create media and update upload
      const media = await createMediaMutation.mutateAsync({
        fileKey,
        needsThumbnail: options.needsThumbnail,
        needsWatermark: options.needsWatermark,
      });

      uploadsRef.current.forEach((upload) => {
        if (upload.file.name == file.name) {
          upload.media = media;
          upload.status = 'success';
        }
      });
      setUploads([...uploadsRef.current]);
    } catch (err) {
      console.error(err);

      // Update upload
      uploadsRef.current.forEach((upload) => {
        if (upload.file.name == file.name) {
          upload.status = 'error';
        }
      });
      setUploads(uploadsRef.current);
    }
  }

  // Track global stsatus
  useEffect(() => {
    let isPending = false;
    let isSuccess = true;
    let isError = false;

    uploads.forEach((upload) => {
      if (!upload.media) {
        isPending = true;
        isSuccess = false;
      }
      if (upload.status === 'error') {
        isError = true;
        isSuccess = false;
      }
    });

    setUploadsState({ isError, isPending, isSuccess });
  }, [uploads]);

  useEffect(() => {
    return () => {
      handleRemoveUploads();
    };
  }, []);

  return {
    accept,
    handleRemoveUpload,
    handleRemoveUploads,
    handleSelectFiles,
    uploads,
    uploadsRef,
    uploadsState,
  };
}

export type UseUploadMedia = ReturnType<typeof useUploadMedia>;
