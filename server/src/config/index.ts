import dotenv from 'dotenv';
import { z } from 'zod';

export let AWS_S3_ENDPOINT_URL: string;
export let AWS_SQS_ENDPOINT_URL: string;

if (process.env.NODE_ENV === 'dev') {
  dotenv.config();

  AWS_S3_ENDPOINT_URL = 'http://localhost:4569';
  AWS_SQS_ENDPOINT_URL = 'http://localhost:4569';
}

export const configSchema = z.object({
  APP: z.object({
    API_DOMAIN: z.string(),
    API_PATH: z.string(),
    API_SOCKET_PATH: z.string(),
    APP_DOMAIN: z.string().url(),
    LISTENING_PORT: z.number(),
    SMTP_EMAIL: z.string().email(),
    SMTP_HOST: z.string(),
    SMTP_PASS: z.string(),
    SMTP_USER: z.string(),
    STRIPE_API_KEY: z.string(),
    STRIPE_PUBLISHABLE_KEY: z.string(),
  }),
  AUTH: z.object({
    GOOGLE_CALLBACK_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    JWT_ACCESS_EXPIRES_IN: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_RESET_PASSWORD_EXPIRES_IN: z.string(),
    JWT_RESET_PASSWORD_SECRET: z.string(),
  }),
  AWS: z.object({
    ACCESS_KEY_ID: z.string(),
    REGION: z.string(),
    SECRET_ACCESS_KEY: z.string(),
  }),
  CACHE: z.object({
    REDIS_URL: z.string().url(),
  }),
  CORS: z.object({
    ALLOWED_ORIGINS: z.string(),
  }),
  DATABASE: z.object({
    URI: z.string().url(),
  }),
  EVENTS: z.object({
    SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_NAME: z.string(),
    SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_URL: z.string(),
    SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_NAME: z.string(),
    SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_URL: z.string(),
  }),
  STORAGE: z.object({
    CLOUDFRONT_BUCKET_MEDIA_DISTRIBUTION_DOMAIN: z.string().url(),
    CLOUDFRONT_BUCKET_MEDIA_KEY_PAIR_ID: z.string(),
    CLOUDFRONT_BUCKET_MEDIA_PRIVATE_KEY: z.string(),
    S3_BUCKET_MEDIA: z.string(),
    S3_BUCKET_MEDIA_PROCESSING: z.string(),
  }),
  THROTTLER: z.object({
    LIMIT: z.number(),
    TTL: z.number(),
  }),
});

export type Config = z.infer<typeof configSchema>;

export const config = configSchema.parse({
  APP: {
    API_DOMAIN: process.env.API_DOMAIN!,
    API_PATH: process.env.API_PATH!,
    API_SOCKET_PATH: process.env.API_SOCKET_PATH!,
    APP_DOMAIN: process.env.APP_DOMAIN!,
    LISTENING_PORT: parseInt(process.env.LISTENING_PORT!),
    SMTP_EMAIL: process.env.SMTP_EMAIL!,
    SMTP_HOST: process.env.SMTP_HOST!,
    SMTP_PASS: process.env.SMTP_PASS!,
    SMTP_USER: process.env.SMTP_USER!,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY!,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY!,
  },
  AUTH: {
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN!,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_RESET_PASSWORD_EXPIRES_IN: process.env.JWT_RESET_PASSWORD_EXPIRES_IN!,
    JWT_RESET_PASSWORD_SECRET: process.env.JWT_RESET_PASSWORD_SECRET!,
  },
  AWS: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
    REGION: process.env.AWS_REGION!,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  CACHE: {
    REDIS_URL: process.env.REDIS_URL!,
  },
  CORS: {
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS!,
  },
  DATABASE: {
    URI: process.env.MONGODB_URI!,
  },
  EVENTS: {
    SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_NAME:
      process.env.SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_NAME!,
    SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_URL:
      process.env.SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_URL!,
    SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_NAME:
      process.env.SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_NAME!,
    SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_URL:
      process.env.SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_URL!,
  },
  STORAGE: {
    CLOUDFRONT_BUCKET_MEDIA_DISTRIBUTION_DOMAIN:
      process.env.CLOUDFRONT_BUCKET_MEDIA_DISTRIBUTION_DOMAIN!,
    CLOUDFRONT_BUCKET_MEDIA_KEY_PAIR_ID:
      process.env.CLOUDFRONT_BUCKET_MEDIA_KEY_PAIR_ID!,
    CLOUDFRONT_BUCKET_MEDIA_PRIVATE_KEY:
      process.env.CLOUDFRONT_BUCKET_MEDIA_PRIVATE_KEY!,
    S3_BUCKET_MEDIA: process.env.S3_BUCKET_MEDIA!,
    S3_BUCKET_MEDIA_PROCESSING: process.env.S3_BUCKET_MEDIA_PROCESSING!,
  },
  THROTTLER: {
    LIMIT: parseInt(process.env.THROTTLER_LIMIT!),
    TTL: parseInt(process.env.THROTTLER_TTL!),
  },
} satisfies Config);
