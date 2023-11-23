import { Socket } from 'socket.io';

export interface MySocket extends Socket {
  memberId: string;
  chatLog: Chat[];
  chatEnd: boolean;
  chatRoomId: string;
}

export type Chat = {
  role: 'user' | 'system' | 'assistant';
  content: string;
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
