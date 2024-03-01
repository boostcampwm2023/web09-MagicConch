import { AiSocket } from 'socket-event';
import { TarotResult } from '@tarot/entities';
import { ChatLog } from './chatbot';

export interface UserInfo {
  email: string;
  providerId: number;
}

export interface ExtendedAiSocket extends AiSocket {
  user?: UserInfo;
  chatLog: ChatLog[];
  chatEnd: boolean;
  result?: TarotResult;
}
