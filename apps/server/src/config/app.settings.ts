import { z } from 'zod';

export const appSettingsSchema = z.object({
  API_PORT: z.number(),
  API_ROOT_PATH: z.string(),
  APP_DOMAIN: z.string().url(),
});

export const appSettings = appSettingsSchema.parse({
  API_PORT: +process.env.API_PORT!,
  API_ROOT_PATH: process.env.API_ROOT_PATH!,
  APP_DOMAIN: process.env.APP_DOMAIN!,
} satisfies z.infer<typeof appSettingsSchema>);
