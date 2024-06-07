import { z } from 'zod';

export const databaseSettingsSchema = z.object({
  MONGODB_URI: z.string().url(),
  REDIS_URL: z.string().url(),
});

export const databaseSettings = databaseSettingsSchema.parse({
  MONGODB_URI: process.env.MONGODB_URI!,
  REDIS_URL: process.env.REDIS_URL!,
} satisfies z.infer<typeof databaseSettingsSchema>);
