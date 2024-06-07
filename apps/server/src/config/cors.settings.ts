import { z } from 'zod';

export const corsSettingsSchema = z.object({
  ALLOWED_ORIGINS: z.string(),
});

export const corsSettings = corsSettingsSchema.parse({
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS!,
} satisfies z.infer<typeof corsSettingsSchema>);
