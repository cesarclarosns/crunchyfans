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

import { settings } from '@/config/settings';

@Injectable()
export class StorageService {
  client = new S3Client({
    credentials: {
      accessKeyId: settings.AWS.ACCESS_KEY_ID,
      secretAccessKey: settings.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: settings.AWS.S3_ENDPOINT_URL,
    forcePathStyle: !!settings.AWS.S3_ENDPOINT_URL,
    region: settings.AWS.REGION,
  });

  constructor(
    @InjectPinoLogger(StorageService.name) private readonly logger: PinoLogger,
  ) {}

  async copy({
    fileKey,
    bucket,
    sourceBucket,
    sourceFileKey,
  }: {
    fileKey: string;
    bucket: string;
    sourceFileKey: string;
    sourceBucket: string;
  }) {
    this.logger.debug('copy');

    const response = await this.client.send(
      new CopyObjectCommand({
        Bucket: bucket,
        CopySource: encodeURI(`/${sourceBucket}/${sourceFileKey}`),
        Key: fileKey,
      }),
    );

    this.logger.debug('copy done');
  }

  async download({
    fileKey,
    folder,
    bucket,
  }: {
    fileKey: string;
    folder: string;
    bucket: string;
  }): Promise<string> {
    this.logger.trace('download');

    const fileName = fileKey.split('/').at(-1);
    const filePath = `${folder}/${fileName}`;

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
    this.logger.debug('upload');

    const upload = new Upload({
      client: this.client,
      params: {
        Body: body,
        Bucket: bucket,
        Key: fileKey,
      },
    });

    upload.on('httpUploadProgress', () => {
      this.logger.info('upload progress');
    });

    await upload.done();

    this.logger.info('upload done');
  }
}
