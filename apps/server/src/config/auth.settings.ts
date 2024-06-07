import { z } from 'zod';

export const authSettingsSchema = z.object({
  GOOGLE_CALLBACK_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  JWT_ACCESS_EXPIRE_MINUTES: z.number(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_LINK_EXPIRE_MINUTES: z.number(),
  JWT_LINK_SECRET: z.string(),
  JWT_REFRESH_EXPIRE_MINUTES: z.number(),
  JWT_REFRESH_SECRET: z.string(),
});

export const authSettings = authSettingsSchema.parse({
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  JWT_ACCESS_EXPIRE_MINUTES: +process.env.JWT_ACCESS_EXPIRE_MINUTES!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_LINK_EXPIRE_MINUTES: +process.env.JWT_LINK_EXPIRE_MINUTES!,
  JWT_LINK_SECRET: process.env.JWT_LINK_SECRET!,
  JWT_REFRESH_EXPIRE_MINUTES: +process.env.JWT_REFRESH_EXPIRE_MINUTES!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
} satisfies z.infer<typeof authSettingsSchema>);
