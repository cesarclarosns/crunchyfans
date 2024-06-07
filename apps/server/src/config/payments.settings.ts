import { z } from 'zod';

export const paymentsSettingsSchema = z.object({
  STRIPE_API_KEY: z.string(),
  STRIPE_PUBLISHABLE_KEY: z.string(),
});

export const paymentsSettings = paymentsSettingsSchema.parse({
  STRIPE_API_KEY: process.env.STRIPE_API_KEY!,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY!,
} satisfies z.infer<typeof paymentsSettingsSchema>);
