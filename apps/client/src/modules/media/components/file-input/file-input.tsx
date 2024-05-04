import { type ChangeEvent, useState } from 'react';

import { type Upload, useUploadFile } from '../../hooks/use-upload-file';

export type FileInputProps = {
  onChange?: (upload?: Upload) => void;
};

export const FileInput = ({}: FileInputProps) => {
  const [upload, setUpload] = useState<Upload | null>(null);

  const uploadFile = useUploadFile();

  const handleRemoveFile = () => {
    if (upload) {
      upload.abortController.abort();
      setUpload(null);
    }
  };

  const handleSelectFiles = (ev: ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.files) return;
  };

  return (
    <div>
      <input type="file" multiple onChange={handleSelectFiles} />
    </div>
  );
};
