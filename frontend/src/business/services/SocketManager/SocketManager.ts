import { Socket, io } from 'socket.io-client';

export class SocketManager {
  #socket: Socket | undefined;

  #url: string;
  #path?: string;

  constructor(url: string, path?: string) {
    this.#url = url;
    this.#path = path;
  }

  get socket(): Socket | undefined {
    return this.#socket;
  }

  get connected(): boolean {
    if (!this.socket) return false;
    return this.socket.connected;
  }

  connect({ withCredentials = false } = {}) {
    if (this.socket?.connected) {
      return;
    }
    try {
      this.#socket = io(this.#url, { path: this.#path, withCredentials });
    } catch (e) {
      // throw new Error('소켓 연결에 실패했습니다.');
      console.error('errorororor: ', e);
      throw e;
    }
  }

  disconnect() {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.disconnect();
    this.#socket = undefined;
  }

  on<U>(eventName: string, eventListener: (args: U) => void) {
    if (!this.socket) {
      throw new Error('소켓이 존재하지 않습니다.');
    }
    this.socket.on(eventName, eventListener);
  }

  emit(eventName: string, ...eventArgs: unknown[]) {
    if (!this.socket) {
      throw new Error('소켓이 존재하지 않습니다.');
    }
    this.socket.emit(eventName, ...eventArgs);
  }
}
