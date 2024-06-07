import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
// import { getSignedUrl as getCloudfrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { awsSettings } from '@/config';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;

  constructor(
    @InjectPinoLogger(StorageService.name) private readonly logger: PinoLogger,
  ) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: awsSettings.ACCESS_KEY_ID,
        secretAccessKey: awsSettings.SECRET_ACCESS_KEY,
      },
      endpoint: awsSettings.S3_ENDPOINT_URL,
      forcePathStyle: !!awsSettings.S3_ENDPOINT_URL,
      region: awsSettings.REGION,
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
