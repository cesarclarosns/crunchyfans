import { Server, Socket } from 'socket.io';

import { TokenPayload } from '@/features/auth/auth.types';
import { ChatDto } from '@/features/chats/dto/chat.dto';
import { MessageDto } from '@/features/chats/dto/message.dto';

export type DefaultCallbackResponse<TPayload> =
  | {
      status: 'success';
      message: string | string[];
      payload: TPayload;
    }
  | {
      status: 'success' | 'failed';
      message: string | string[];
      errors: { [key: string]: string | string[] };
    };

export type ClientToServerEvents = {
  'chats/join-chat': (
    ev: {
      chatId: string;
    },
    cb: (response: DefaultCallbackResponse<null>) => void,
  ) => void;

  'chats/user-typing': (
    ev: {
      chatId: string;
    },
    cb: (response: DefaultCallbackResponse<null>) => void,
  ) => void;

  'users/get-status': (
    ev: { users: string[] },
    cb: (
      response: DefaultCallbackResponse<{
        online: string[];
        offline: string[];
      }>,
    ) => void,
  ) => void;
};

export type ServerToClientEvents = {
  'chats/new-message': (ev: { message: MessageDto; chat: ChatDto }) => void;

  'chats/user-typing': (ev: { chatId: string; userId: string }) => void;

  'chats/message-read': (ev: {
    chatId: string;
    messageId: string;
    userId: string;
  }) => void;

  'notifications/new-notification': (ev: { notification: unknown }) => void;
};

export interface InterServerEvents {}

export interface SocketData extends TokenPayload {}

export interface CustomSocket
  extends Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  > {}

export interface CustomServer
  extends Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  > {}

/**
 * Helpers
 */

export type EventPayload<T> = T extends (...args: infer P) => any
  ? P[0]
  : never;

export type CallbackResponse<T> = T extends (...args: infer P1) => any
  ? P1[1] extends (...args: infer P2) => any
    ? P2[0]
    : never
  : never;
