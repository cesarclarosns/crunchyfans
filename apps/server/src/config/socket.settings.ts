import { z } from 'zod';

export const socketSettingsSchema = z.object({
  SOCKET_PORT: z.number(),
  SOCKET_ROOT_PATH: z.string(),
});

export const socketSettings = socketSettingsSchema.parse({
  SOCKET_PORT: +process.env.SOCKET_PORT!,
  SOCKET_ROOT_PATH: process.env.SOCKET_ROOT_PATH!,
} satisfies z.infer<typeof socketSettingsSchema>);
