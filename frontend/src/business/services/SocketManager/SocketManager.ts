import { Socket, io } from 'socket.io-client';

class SocketManager {
  static socket: Socket | undefined;

  #url: string;
  #path?: string;

  constructor(url: string, path?: string) {
    this.#url = url;
    this.#path = path;
  }

  connect() {
    if (SocketManager.socket) {
      SocketManager.socket.disconnect();
    }
    SocketManager.socket = io(this.#url, { path: this.#path });
  }

  disconnect() {
    if (!SocketManager.socket) {
      throw new Error('소켓이 존재하지 않습니다.');
    }
    SocketManager.socket.disconnect();
    SocketManager.socket = undefined;
  }

  on<U>(eventName: string, eventListener: (args: U) => void) {
    if (!SocketManager.socket) {
      throw new Error('소켓이 존재하지 않습니다.');
    }
    SocketManager.socket.on(eventName, eventListener);
  }

  emit(eventName: string, ...eventArgs: unknown[]) {
    if (!SocketManager.socket) {
      throw new Error('소켓이 존재하지 않습니다.');
    }
    SocketManager.socket.emit(eventName, ...eventArgs);
  }
}

export default SocketManager;
