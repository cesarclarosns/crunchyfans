import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
// import { getSignedUrl as getCloudfrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

import { settings } from '@/config/settings';

import { IStorageService } from '../../domain/services/storage.service';

@Injectable()
export class StorageService implements IStorageService {
  private readonly s3Client = new S3Client({
    credentials: {
      accessKeyId: settings.AWS.ACCESS_KEY_ID,
      secretAccessKey: settings.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: settings.AWS.S3_ENDPOINT_URL,
    forcePathStyle: !!settings.AWS.S3_ENDPOINT_URL,
    region: settings.AWS.REGION,
  });

  async createDownloadUrl(fileKey: string): Promise<string> {
    return await getS3SignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: 'bucket',
        Key: fileKey,
      }),
    );
  }

  async createUploadUrl(fileKey: string) {
    return await getS3SignedUrl(
      this.s3Client,
      new PutObjectCommand({
        Bucket: 'bucket',
        Key: fileKey,
      }),
    );
  }
}
