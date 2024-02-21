import { SocketManager } from '.';

export class AISocketManager extends SocketManager {
  static instance: AISocketManager | null = null;

  private constructor() {
    super(import.meta.env.VITE_WAS_URL);
  }

  static getInstance(): AISocketManager {
    if (!this.instance) {
      this.instance = new AISocketManager();
    }
    return this.instance;
  }

  connect() {
    super.connect({ withCredentials: true });
  }

  on<U>(eventName: string, eventListener: (args: U) => void) {
    super.on(eventName, eventListener);
  }

  emit(eventName: string, ...eventArgs: unknown[]) {
    super.emit(eventName, ...eventArgs);
  }
}
