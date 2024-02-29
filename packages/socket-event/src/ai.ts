import { Server, Socket } from 'socket.io';

export interface AiSocketEvent {
  ServerToClientEvent: {
    streamStart: () => void;
    streaming: (token: string) => void;
    streamEnd: () => void;
    tarotCard: () => void; // 타로 카드 펼치기 요청
    chatEnd: (resultId: string) => void;
    error: (message: string) => void;
  };
  ClientToServerEvent: {
    message: (message: string) => void;
    tarotRead: (cardIdx: number) => void; // 타로 카드 해설 요청
  };
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
}

interface UserInfo {
  email: string;
  providerId: number;
}

interface ChatLog {
  isHost: boolean;
  message: string;
}

export type AiSocketClientEvent = keyof AiSocketEvent['ClientToServerEvent'];

export type AiSocketClientEventParams<T extends AiSocketClientEvent> =
  Parameters<AiSocketEvent['ClientToServerEvent'][T]>;
