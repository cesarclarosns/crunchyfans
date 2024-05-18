import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
// import { getSignedUrl as getCloudfrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import fs, { read } from 'fs-extra';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { settings } from '@/config/settings';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;

  constructor(
    @InjectPinoLogger(StorageService.name) private readonly logger: PinoLogger,
  ) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: settings.AWS.ACCESS_KEY_ID,
        secretAccessKey: settings.AWS.SECRET_ACCESS_KEY,
      },
      endpoint: settings.AWS.S3_ENDPOINT_URL,
      forcePathStyle: !!settings.AWS.S3_ENDPOINT_URL,
      region: settings.AWS.REGION,
    });
  }

  async createDownloadUrl({
    fileKey,
    bucket,
  }: {
    fileKey: string;
    bucket: string;
  }): Promise<string> {
    return await getS3SignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: bucket,
        Key: fileKey,
      }),
    );
  }

  async createUploadUrl({
    fileKey,
    bucket,
  }: {
    fileKey: string;
    bucket: string;
  }) {
    return await getS3SignedUrl(
      this.s3Client,
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileKey,
      }),
    );
  }

  async upload({
    fileKey,
    filePath,
    bucket,
  }: {
    filePath: string;
    fileKey: string;
    bucket: string;
  }): Promise<void> {
    const body = fs.createReadStream(filePath);

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Body: body,
        Bucket: bucket,
        Key: fileKey,
      },
    });

    upload.on('httpUploadProgress', (progress) => {
      this.logger.info('upload progress', progress);
    });

    await upload.done();

    this.logger.info('upload done');
  }
}
