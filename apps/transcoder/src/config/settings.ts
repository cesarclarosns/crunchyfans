import dotenv from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'dev') {
  dotenv.config();
}

export const settingsSchema = z.object({
  AWS: z.object({
    ACCESS_KEY_ID: z.string(),
    REGION: z.string(),
    S3_ENDPOINT_URL: z.string().optional(),
    SECRET_ACCESS_KEY: z.string(),
    SQS_ENDPOINT_URL: z.string().optional(),
  }),
  TRANSCODER: z.object({
    S3_BUCKET_MEDIA_NAME: z.string(),
    S3_BUCKET_MEDIA_PROCESSING_NAME: z.string(),
    SQS_QUEUE_TRANSCODE_MEDIA_COMPLETE_NAME: z.string(),
    SQS_QUEUE_TRANSCODE_MEDIA_COMPLETE_URL: z.string(),
    SQS_QUEUE_TRANSCODE_MEDIA_SUBMIT_NAME: z.string(),
    SQS_QUEUE_TRANSCODE_MEDIA_SUBMIT_URL: z.string(),
  }),
});

export type Settings = z.infer<typeof settingsSchema>;

export const settings = settingsSchema.parse({
  AWS: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
    REGION: process.env.AWS_REGION!,
    S3_ENDPOINT_URL:
      process.env.NODE_ENV == 'dev' ? 'http://localhost:4569' : undefined,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    SQS_ENDPOINT_URL:
      process.env.NODE_ENV == 'dev' ? 'http://0.0.0.0:9324' : undefined,
  },

  TRANSCODER: {
    S3_BUCKET_MEDIA_NAME: process.env.MEDIA_S3_BUCKET_MEDIA_NAME!,
    S3_BUCKET_MEDIA_PROCESSING_NAME:
      process.env.S3_BUCKET_MEDIA_PROCESSING_NAME!,
    SQS_QUEUE_TRANSCODE_MEDIA_COMPLETE_NAME:
      process.env.SQS_QUEUE_TRANSCODE_MEDIA_COMPLETE_NAME!,
    SQS_QUEUE_TRANSCODE_MEDIA_COMPLETE_URL:
      process.env.SQS_QUEUE_TRANSCODE_MEDIA_COMPLETE_URL!,
    SQS_QUEUE_TRANSCODE_MEDIA_SUBMIT_NAME:
      process.env.SQS_QUEUE_TRANSCODE_MEDIA_SUBMIT_NAME!,
    SQS_QUEUE_TRANSCODE_MEDIA_SUBMIT_URL:
      process.env.SQS_QUEUE_TRANSCODE_MEDIA_SUBMIT_URL!,
  },
} satisfies Settings);
