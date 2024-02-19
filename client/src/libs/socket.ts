import { io } from 'socket.io-client';

import { type CustomSocket } from '@/common/interfaces/socket';
import { env } from '@/env';

export const socket: CustomSocket = io(env.NEXT_PUBLIC_API_DOMAIN, {
  autoConnect: false,
  path: env.NEXT_PUBLIC_API_SOCKET_PATH,
  transports: ['websocket'],
});
