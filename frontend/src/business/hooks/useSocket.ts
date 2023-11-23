import { Socket, io } from 'socket.io-client';

interface SocketTypesMap {
  AIChat: {
    OnEventName: 'tarotCard' | 'chatEnd' | 'streamStart' | 'streaming' | 'streamEnd';
    EmitEventName: 'message' | 'tarotRead' | 'tarotRead';
  };
  WebRTC: {
    OnEventName: 'welcome' | 'offer' | 'answer' | 'candidate' | 'roomFull';
    EmitEventName: 'offer' | 'answer' | 'candidate' | 'joinRoom';
  };
}

type SocketType = keyof SocketTypesMap;

const sockets = {} as Record<SocketType, Socket>;

export function useSocket<T extends SocketType>(socketType: T) {
  function connectSocket(url: string) {
    if (sockets[socketType]) {
      throw new Error('소켓이 이미 존재합니다.');
    }
    sockets[socketType] = io(url);
  }

  function disconnectSocket() {
    if (!sockets[socketType]) {
      throw new Error('소켓이 존재하지 않습니다.');
    }
    sockets[socketType].disconnect();
    delete sockets[socketType];
  }

  function socketOn<U>(eventName: SocketTypesMap[T]['OnEventName'], eventListener: (args: U) => void) {
    sockets[socketType].on(eventName, eventListener as any);
  }

  function socketEmit(eventName: SocketTypesMap[T]['EmitEventName'], ...eventArgs: unknown[]) {
    sockets[socketType].emit(eventName, ...eventArgs);
  }

  return { connectSocket, disconnectSocket, socketOn, socketEmit };
}
