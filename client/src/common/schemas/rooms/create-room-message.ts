import { z } from 'zod';

import { roomMessageSchema } from '@/models/rooms/room-message';

export const createRoomMessageSchema = roomMessageSchema
  .pick({
    content: true,
    gif: true,
    roomId: true,
  })
  .extend({
    media: z.array(z.string().min(1)),
  });

export type TCreateRoomMessage = z.infer<typeof createRoomMessageSchema>;
