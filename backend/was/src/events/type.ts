import { Socket } from 'socket.io';

type Role = 'user' | 'system' | 'assistant';

export interface MySocket extends Socket {
  memberId: string;
  chatLog: Chat[];
  chatEnd: boolean;
  chatRoomId: string;
}

export type Chat = {
  role: Role;
  content: string;
};

export type Message = {
  roomId: string;
  chat: Chat;
};

export type ClovaEvent = {
  id: string;
  event: string;
  data: ClovaEventData;
};

type ClovaEventData = {
  message: {
    role: string;
    content: string;
  };
};
