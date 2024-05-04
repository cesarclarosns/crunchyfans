import { type ChangeEvent, useRef, useState } from 'react';

import {
  type Upload,
  useUploadFile,
} from '@/modules/media/hooks/use-upload-file';
import { Button } from '@/modules/ui/components/button';

export type FilesInputProps = {
  onChange?: (uploads: Upload[]) => void;
};

export const FilesInput = ({}: FilesInputProps) => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const uploadsRef = useRef<Upload[]>([]);

  const uploadFile = useUploadFile();

  const handleRemoveFile = (file: File) => {
    const index = uploadsRef.current.findIndex(
      (upload) => upload.file.name === file.name,
    );

    if (index !== -1) {
      const upload = uploadsRef.current[index];
      upload!.abortController.abort();
      uploadsRef.current.splice(index, 1);
    }

    setUploads(uploadsRef.current);
  };

  const handleSelectFiles = (ev: ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.files) return;

    const files = Object.values(ev.target.files);
    for (const file of files) {
      let upload = uploadsRef.current.find(
        (upload) => upload.file.name === file.name,
      );

      if (!upload) {
        const abortController = new AbortController();

        uploadsRef.current.push({
          abortController,
          file,
          hasError: false,
          isReady: false,
          progress: 0,
        });

        uploadFile
          .mutateAsync({
            file,
            onUploadProgress(progressEvent) {
              for (const upload of uploadsRef.current) {
                if (upload.file.name === file.name) {
                  upload.progress = progressEvent.progress! * 100;
                }
              }
              setUploads(uploadsRef.current);
            },
            signal: abortController.signal,
          })
          .then(({ mediaId }) => {
            for (const upload of uploadsRef.current) {
              if (upload.file.name === file.name) {
                upload.isReady = true;
                upload.mediaId = mediaId;
              }
            }
            setUploads(uploadsRef.current);
          })
          .catch((err: Error) => {
            console.error(err);

            for (const upload of uploadsRef.current) {
              if (upload.file.name === file.name) {
                upload.hasError = true;
              }
            }
            setUploads(uploadsRef.current);
          });
      }
    }
  };

  return (
    <div className="flex">
      <input multiple onChange={handleSelectFiles} />
      <div className="flex flex-row">
        {uploads.map((upload) => (
          <div key={upload.file.name}>
            <p>Filename: {upload.file.name}</p>
            <p>Progress: {upload.progress}</p>
            <Button onClick={() => handleRemoveFile(upload.file)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
