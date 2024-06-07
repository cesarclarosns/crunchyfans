import { z } from 'zod';

export const throttlerSettingsSchema = z.object({
  THROTTLER_LIMIT: z.number(),
  THROTTLER_TTL: z.number(),
});

export const throttlerSettings = throttlerSettingsSchema.parse({
  THROTTLER_LIMIT: +process.env.THROTTLER_LIMIT!,
  THROTTLER_TTL: +process.env.THROTTLER_TTL!,
} satisfies z.infer<typeof throttlerSettingsSchema>);
