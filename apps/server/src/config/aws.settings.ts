import { z } from 'zod';

export const awsSettingsSchema = z.object({
  ACCESS_KEY_ID: z.string(),
  REGION: z.string(),
  S3_ENDPOINT_URL: z.string().optional(),
  SECRET_ACCESS_KEY: z.string(),
  SQS_ENDPOINT_URL: z.string().optional(),
});

export const awsSettings = awsSettingsSchema.parse({
  ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  REGION: process.env.AWS_REGION!,
  S3_ENDPOINT_URL:
    process.env.NODE_ENV === 'local' ? 'http://localhost:4569' : undefined,
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  SQS_ENDPOINT_URL:
    process.env.NODE_ENV === 'local' ? 'http://0.0.0.0:9324' : undefined,
} satisfies z.infer<typeof awsSettingsSchema>);
