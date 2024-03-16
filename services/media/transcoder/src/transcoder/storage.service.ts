import {
  CopyObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';
import fs, { ReadStream } from 'fs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Readable } from 'stream';

import { AWS_S3_ENDPOINT_URL, config } from '@/config';

@Injectable()
export class StorageService {
  client = new S3Client({
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: AWS_S3_ENDPOINT_URL,
    forcePathStyle: !!AWS_S3_ENDPOINT_URL,
    region: config.AWS_REGION,
  });

  constructor(
    @InjectPinoLogger(StorageService.name) private readonly logger: PinoLogger,
  ) {}

  async download({
    fileKey,
    dir,
    bucket,
  }: {
    fileKey: string;
    dir: string;
    bucket: string;
  }): Promise<string> {
    this.logger.trace({ bucket, fileKey }, 'download');

    const fileName = fileKey.split('/').at(-1);
    const filePath = `${dir}/${fileName}`;

    const response = await this.client.send(
      new GetObjectCommand({ Bucket: bucket, Key: fileKey }),
    );

    const readStream = response.Body as Readable;
    const writeStream = fs.createWriteStream(filePath);

    await new Promise<void>((resolve, reject) => {
      readStream.on('end', () => resolve());
      readStream.on('error', (err) => reject(err));
      readStream.pipe(writeStream);
    });

    this.logger.trace('download done');

    return filePath;
  }

  async upload({
    fileKey,
    bucket,
    body,
  }: {
    fileKey: string;
    bucket: string;
    body: ReadStream;
  }): Promise<void> {
    this.logger.debug({ bucket, fileKey }, 'upload');

    const upload = new Upload({
      client: this.client,
      params: {
        Body: body,
        Bucket: bucket,
        Key: fileKey,
      },
    });

    upload.on('httpUploadProgress', (progress) => {
      this.logger.info({ fileKey, progress }, 'upload progress');
    });

    await upload.done();

    this.logger.info({ fileKey }, 'upload done');
  }
}
