import { SocketManager } from '.';

export class HumanSocketManager extends SocketManager {
  static instance: HumanSocketManager | null = null;

  private constructor() {
    super(import.meta.env.VITE_HUMAN_SOCKET_URL, '/signal');
  }

  static getInstance(): HumanSocketManager {
    if (!this.instance) {
      this.instance = new HumanSocketManager();
    }
    return this.instance;
  }

  on<U>(eventName: string, eventListener: (args: U) => void) {
    super.on(eventName, eventListener);
  }

  emit(eventName: string, ...eventArgs: unknown[]) {
    super.emit(eventName, ...eventArgs);
  }
}
