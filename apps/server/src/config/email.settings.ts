import { z } from 'zod';

export const emailSettingsSchema = z.object({
  SMTP_EMAIL: z.string().email(),
  SMTP_HOST: z.string(),
  SMTP_PASS: z.string(),
  SMTP_USER: z.string(),
});

export const emailSettings = emailSettingsSchema.parse({
  SMTP_EMAIL: process.env.SMTP_EMAIL!,
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PASS: process.env.SMTP_PASS!,
  SMTP_USER: process.env.SMTP_USER!,
} satisfies z.infer<typeof emailSettingsSchema>);
