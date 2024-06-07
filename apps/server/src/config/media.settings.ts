import { z } from 'zod';

export const mediaSettingsSchema = z.object({
  S3_BUCKET_MEDIA_NAME: z.string(),
  S3_BUCKET_MEDIA_PROCESSING_NAME: z.string(),
});

export const mediaSettings = mediaSettingsSchema.parse({
  S3_BUCKET_MEDIA_NAME: process.env.S3_BUCKET_MEDIA_NAME!,
  S3_BUCKET_MEDIA_PROCESSING_NAME: process.env.S3_BUCKET_MEDIA_PROCESSING_NAME!,
} satisfies z.infer<typeof mediaSettingsSchema>);
