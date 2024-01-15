import { Socket as originalSocket } from 'socket.io';
import { ChatLog } from './chatbot';

export interface Socket extends originalSocket {
  chatLog: ChatLog[];
  chatEnd: boolean;
}
