import { useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';

interface SocketTypesMap {
  AIChat: {
    OnEventName: 'tarotCard' | 'chatEnd' | 'streamStart' | 'streaming' | 'streamEnd';
    EmitEventName: 'message' | 'tarotRead' | 'tarotRead';
  };
  WebRTC: {
    OnEventName:
      | 'welcome'
      | 'offer'
      | 'answer'
      | 'candidate'
      | 'roomFull'
      | 'userExit'
      | 'roomCreated'
      | 'joinRoomFailed'
      | 'joinRoomSuccess'
      | 'createRoomFailed'
      | 'createRoomSuccess';
    EmitEventName: 'offer' | 'answer' | 'candidate' | 'joinRoom' | 'createRoom';
  };
}

type ConnectSocketOptions = {
  reconnect: boolean;
};

type SocketType = keyof SocketTypesMap;

const sockets = {} as Record<SocketType, Socket>;

export function useSocket<T extends SocketType>(socketType: T) {
  const navigate = useNavigate();

  const ConnectSocketDefaultOptions = {
    reconnect: false,
  };

  function connectSocket(url: string, { reconnect }: ConnectSocketOptions = ConnectSocketDefaultOptions) {
    if (sockets[socketType]) {
      if (!reconnect) {
        throw new Error('소켓이 이미 존재합니다.');
      }
      sockets[socketType].disconnect();
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
    if (!sockets[socketType]) {
      navigate('/');
      return;
    }
    sockets[socketType].on(eventName, eventListener as any);
  }

  function socketEmit(eventName: SocketTypesMap[T]['EmitEventName'], ...eventArgs: unknown[]) {
    if (!sockets[socketType]) {
      navigate('/');
      return;
    }
    sockets[socketType].emit(eventName, ...eventArgs);
  }

  function isSocketConnected() {
    return Boolean(sockets[socketType]);
  }

  return { connectSocket, disconnectSocket, socketOn, socketEmit, isSocketConnected };
}
