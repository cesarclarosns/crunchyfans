import { type z } from 'zod';

import { createRoomSchema } from './create-room';

export const editRoomSchema = createRoomSchema.partial();

export type EditRoomSchema = z.infer<typeof editRoomSchema>;
