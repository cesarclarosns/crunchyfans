import { type z } from 'zod';

import { roomSchema } from './room.schema';

export const createRoomSchema = roomSchema.pick({
  language: true,
  name: true,
  status: true,
  tags: true,
  type: true,
});

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;
