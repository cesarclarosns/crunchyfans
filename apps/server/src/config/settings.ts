import dotenv from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'dev') {
  dotenv.config();
}

export const settingsSchema = z.object({
  API: z.object({
    LISTENING_PORT: z.number(),
    PREFIX: z.string(),
  }),
  APP: z.object({
    DOMAIN: z.string().url(),
  }),
  AUTH: z.object({
    GOOGLE_CALLBACK_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    JWT_ACCESS_EXPIRE_MINUTES: z.number(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_LINK_EXPIRE_MINUTES: z.number(),
    JWT_LINK_SECRET: z.string(),
    JWT_REFRESH_EXPIRE_MINUTES: z.number(),
    JWT_REFRESH_SECRET: z.string(),
  }),
  AWS: z.object({
    ACCESS_KEY_ID: z.string(),
    REGION: z.string(),
    S3_ENDPOINT_URL: z.string().optional(),
    SECRET_ACCESS_KEY: z.string(),
    SQS_ENDPOINT_URL: z.string().optional(),
  }),
  CORS: z.object({
    ALLOWED_ORIGINS: z.string(),
  }),
  DATABASES: z.object({
    MONGODB_URI: z.string().url(),
    REDIS_URL: z.string().url(),
  }),
  EMAIL: z.object({
    SMTP_EMAIL: z.string().email(),
    SMTP_HOST: z.string(),
    SMTP_PASS: z.string(),
    SMTP_USER: z.string(),
  }),
  MEDIA: z.object({
    S3_BUCKET_MEDIA_NAME: z.string(),
    S3_BUCKET_MEDIA_PROCESSING_NAME: z.string(),
  }),
  PAYMENTS: z.object({
    STRIPE_API_KEY: z.string(),
    STRIPE_PUBLISHABLE_KEY: z.string(),
  }),
  SOCKET: z.object({
    PATH: z.string(),
  }),
  THROTTLER: z.object({
    LIMIT: z.number(),
    TTL: z.number(),
  }),
});

export type Settings = z.infer<typeof settingsSchema>;

export const settings = settingsSchema.parse({
  API: {
    LISTENING_PORT: +process.env.LISTENING_PORT!,
    PREFIX: process.env.API_PREFIX!,
  },
  APP: {
    DOMAIN: process.env.APP_DOMAIN!,
  },
  AUTH: {
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    JWT_ACCESS_EXPIRE_MINUTES: +process.env.JWT_ACCESS_EXPIRE_MINUTES!,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_LINK_EXPIRE_MINUTES: +process.env.JWT_LINK_EXPIRE_MINUTES!,
    JWT_LINK_SECRET: process.env.JWT_LINK_SECRET!,
    JWT_REFRESH_EXPIRE_MINUTES: +process.env.JWT_REFRESH_EXPIRE_MINUTES!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  },
  AWS: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
    REGION: process.env.AWS_REGION!,
    S3_ENDPOINT_URL:
      process.env.NODE_ENV === 'dev' ? 'http://localhost:4569' : undefined,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    SQS_ENDPOINT_URL:
      process.env.NODE_ENV === 'dev' ? 'http://0.0.0.0:9324' : undefined,
  },
  CORS: {
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS!,
  },
  DATABASES: {
    MONGODB_URI: process.env.MONGODB_URI!,
    REDIS_URL: process.env.REDIS_URL!,
  },
  EMAIL: {
    SMTP_EMAIL: process.env.SMTP_EMAIL!,
    SMTP_HOST: process.env.SMTP_HOST!,
    SMTP_PASS: process.env.SMTP_PASS!,
    SMTP_USER: process.env.SMTP_USER!,
  },
  MEDIA: {
    S3_BUCKET_MEDIA_NAME: process.env.S3_BUCKET_MEDIA_NAME!,
    S3_BUCKET_MEDIA_PROCESSING_NAME:
      process.env.S3_BUCKET_MEDIA_PROCESSING_NAME!,
  },
  PAYMENTS: {
    STRIPE_API_KEY: process.env.STRIPE_API_KEY!,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY!,
  },
  SOCKET: {
    PATH: process.env.SOCKET_PATH!,
  },
  THROTTLER: {
    LIMIT: +process.env.THROTTLER_LIMIT!,
    TTL: +process.env.THROTTLER_TTL!,
  },
} satisfies Settings);
