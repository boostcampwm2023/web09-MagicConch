import { Server, Socket } from 'socket.io';
import { TarotResult } from '@tarot/entities';
import { ChatLog } from './chatbot';

export interface UserInfo {
  email: string;
  providerId: number;
}

export type AiServer = Server<
  AiSocketEvent['ClientToServerEvent'],
  AiSocketEvent['ServerToClientEvent']
>;

export interface AiSocket
  extends Socket<
    AiSocketEvent['ClientToServerEvent'],
    AiSocketEvent['ServerToClientEvent']
  > {
  user?: UserInfo;
  chatLog: ChatLog[];
  chatEnd: boolean;
  result?: TarotResult;
}

export type AiSocketClientEvent = keyof AiSocketEvent['ClientToServerEvent'];

export type AiSocketClientEventParams<T extends AiSocketClientEvent> =
  Parameters<AiSocketEvent['ClientToServerEvent'][T]>;
