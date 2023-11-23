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
