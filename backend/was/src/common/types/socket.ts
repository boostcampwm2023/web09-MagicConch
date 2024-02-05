import { Socket as originalSocket } from 'socket.io';
import { ChatLog } from './chatbot';

export interface UserInfo {
  email: string;
  providerId: number;
}
export interface Socket extends originalSocket {
  user?: UserInfo;
  chatLog: ChatLog[];
  chatEnd: boolean;
}
