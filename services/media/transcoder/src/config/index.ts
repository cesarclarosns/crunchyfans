import dotenv from 'dotenv';
import { z } from 'zod';

export let AWS_S3_ENDPOINT_URL: string;
export let AWS_SQS_ENDPOINT_URL: string;

if (process.env.NODE_ENV === 'dev') {
  dotenv.config();

  AWS_S3_ENDPOINT_URL = 'http://localhost:4569';
  AWS_SQS_ENDPOINT_URL = 'http://0.0.0.0:9324';
}

export const configSchema = z.object({
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_REGION: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  S3_BUCKET_MEDIA: z.string(),
  S3_BUCKET_MEDIA_PROCESSING: z.string(),
  SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_NAME: z.string(),
  SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_URL: z.string(),
  SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_NAME: z.string(),
  SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_URL: z.string(),
});

export type Config = z.infer<typeof configSchema>;

export const config = configSchema.parse({
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  AWS_REGION: process.env.AWS_REGION!,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  S3_BUCKET_MEDIA: process.env.S3_BUCKET_MEDIA!,
  S3_BUCKET_MEDIA_PROCESSING: process.env.S3_BUCKET_MEDIA_PROCESSING!,
  SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_NAME:
    process.env.SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_NAME!,
  SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_URL:
    process.env.SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_URL!,
  SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_NAME:
    process.env.SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_NAME!,
  SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_URL:
    process.env.SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_URL!,
} satisfies Config);
