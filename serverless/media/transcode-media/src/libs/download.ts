import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import fs from "fs";

export async function download(
  client: S3Client,
  { fileKey, bucket }: { fileKey: string; bucket: string }
): Promise<string> {
  const fileName = fileKey.split("/").at(-1);
  const filePath = `/tmp/${fileName}`;

  const response = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: fileKey })
  );
  const readStream = response.Body as Readable;

  const writeStream = fs.createWriteStream(filePath);

  await new Promise<void>((resolve, reject) => {
    readStream.on("end", () => resolve());
    readStream.on("error", (err) => reject(err));
    readStream.pipe(writeStream);
  });

  return filePath;
}
