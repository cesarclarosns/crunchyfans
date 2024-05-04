import { type Socket } from 'socket.io-client';

import { type Chat } from '@/modules/chats/schemas/chat';
import { type Message } from '@/modules/chats/schemas/message';

export type DefaultCallbackResponse<TPayload> =
  | {
      status: 'success';
      payload: TPayload;
    }
  | {
      status: 'failed';
      message: string | string[];
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
  'chats/new-message': (ev: { chat: Chat; message: Message }) => void;

  'chats/user-typing': (ev: { chatId: string; userId: string }) => void;

  'chats/message-read': (ev: {
    chatId: string;
    messageId: string;
    userId: string;
  }) => void;

  'notifications/new-notification': (ev: { notification: unknown }) => void;
};

export type CustomSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

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
