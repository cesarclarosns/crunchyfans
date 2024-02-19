import { z } from 'zod';

import { ROOM_STATUS, ROOM_TYPE } from '@/common/constants/rooms';

export const roomSchema = z.object({
  createdAt: z.coerce.date(),
  language: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  status: z.enum([ROOM_STATUS.ended, ROOM_STATUS.started, ROOM_STATUS.waiting]),
  tags: z.array(z.string().min(1)).optional(),
  type: z.enum([ROOM_TYPE.group, ROOM_TYPE['one-to-one']]),
});

export type Room = z.infer<typeof roomSchema>;
