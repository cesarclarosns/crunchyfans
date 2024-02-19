import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { ReadStream } from "fs";

export async function upload(
  client: S3Client,
  {
    fileKey,
    bucket,
    body,
  }: { fileKey: string; bucket: string; body: ReadStream }
) {
  const upload = new Upload({
    client,
    params: {
      Body: body,
      Key: fileKey,
      Bucket: bucket,
    },
  });

  upload.on("httpUploadProgress", (progress) => {
    console.log(`${fileKey} uploadProgress: `, progress);
  });

  return await upload.done();
}
