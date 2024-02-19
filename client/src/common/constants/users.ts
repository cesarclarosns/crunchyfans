import { type ObjectValues } from '../types/object-values';

export const USER_STATUS = {
  offline: 'offline',
  online: 'online',
} as const;

export type UserStatus = ObjectValues<typeof USER_STATUS>;
