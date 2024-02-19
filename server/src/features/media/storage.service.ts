import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl as getCloudfrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';

import { config } from '@/config';

@Injectable()
export class StorageService {
  private readonly s3Client = new S3Client({
    credentials: {
      accessKeyId: config.AWS.ACCESS_KEY_ID,
      secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
    },
    region: config.AWS.REGION,
  });

  // Upload

  async createUploadSignedUrl({
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

  // Multipart upload

  async createMultipartUpload({
    fileKey,
    bucket,
  }: {
    fileKey: string;
    bucket: string;
  }) {
    return await this.s3Client.send(
      new CreateMultipartUploadCommand({
        Bucket: bucket,
        Key: fileKey,
      }),
    );
  }

  async createUploadPartSignedUrl({
    fileKey,
    uploadId,
    partNumber,
    bucket,
  }: {
    fileKey: string;
    uploadId: string;
    partNumber: number;
    bucket: string;
  }) {
    return await getS3SignedUrl(
      this.s3Client,
      new UploadPartCommand({
        Bucket: bucket,
        Key: fileKey,
        PartNumber: partNumber,
        UploadId: uploadId,
      }),
      {
        expiresIn: 60 * 60,
      },
    );
  }

  async completeMultipartUpload({
    fileKey,
    uploadId,
    parts,
    bucket,
  }: {
    fileKey: string;
    uploadId: string;
    parts: { partNumber: number; etag: string }[];
    bucket: string;
  }) {
    return await this.s3Client.send(
      new CompleteMultipartUploadCommand({
        Bucket: bucket,
        Key: fileKey,
        MultipartUpload: {
          Parts: parts.map((part) => ({
            ETag: part.etag,
            PartNumber: part.partNumber,
          })),
        },
        UploadId: uploadId,
      }),
    );
  }

  async deleteMultipartUpload({
    fileKey,
    uploadId,
    bucket,
  }: {
    fileKey: string;
    uploadId: string;
    bucket: string;
  }) {
    return await this.s3Client.send(
      new AbortMultipartUploadCommand({
        Bucket: bucket,
        Key: fileKey,
        UploadId: uploadId,
      }),
    );
  }

  // Download

  download(fileKey: string): string {
    const dateLessThan = addDays(new Date(), 7).toISOString().split('T')[0];
    const url = `${config.STORAGE.CLOUDFRONT_BUCKET_MEDIA_DISTRIBUTION_DOMAIN}/${fileKey}`;
    const privateKey = Buffer.from(
      config.STORAGE.CLOUDFRONT_BUCKET_MEDIA_PRIVATE_KEY,
      'base64',
    ).toString('ascii');

    const signedUrl = getCloudfrontSignedUrl({
      dateLessThan,
      keyPairId: config.STORAGE.CLOUDFRONT_BUCKET_MEDIA_KEY_PAIR_ID,
      privateKey,
      url,
    });

    return signedUrl;
  }
}
