import { z } from 'zod';

export const roomMessageSchema = z.object({});

export type RoomMessage = z.infer<typeof roomMessageSchema>;
