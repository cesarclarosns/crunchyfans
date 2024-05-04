import { io } from 'socket.io-client';

import { env } from '@/env';

import { type CustomSocket } from '../types/socket';

export const socket: CustomSocket = io(env.NEXT_PUBLIC_API_DOMAIN, {
  autoConnect: false,
  path: env.NEXT_PUBLIC_API_SOCKET_PATH,
  transports: ['websocket'],
});
