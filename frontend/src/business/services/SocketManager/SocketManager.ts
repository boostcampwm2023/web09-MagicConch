import { Socket, io } from 'socket.io-client';

interface EventsMap {
  [event: string]: any;
}

export class SocketManager<T1 extends EventsMap, T2 extends EventsMap> {
  #socket: Socket<T1, T2> | undefined;

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
    if (!this.#socket) return false;
    return this.#socket.connected;
  }

  connect({ withCredentials = false } = {}) {
    if (this.#socket?.connected) {
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
    if (!this.#socket?.connected) {
      return;
    }
    this.#socket.disconnect();
    this.#socket = undefined;
  }

  on(...params: Parameters<Socket<T1, T2>['on']>) {
    if (!this.#socket) {
      throw new Error('소켓이 존재하지 않습니다.');
    }
    this.#socket.on(...params);
  }

  emit(...params: Parameters<Socket<T1, T2>['emit']>) {
    if (!this.#socket) {
      throw new Error('소켓이 존재하지 않습니다.');
    }
    this.#socket.emit(...params);
  }
}
