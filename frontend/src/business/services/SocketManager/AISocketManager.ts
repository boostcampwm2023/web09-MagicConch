import { SocketManager } from '.';
import { AIClientEvent, AIServerEvent } from '@tarotmilktea/ai-socketio-event';

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

  on<U>(eventName: AIServerEvent, eventListener: (args: U) => void) {
    super.on(eventName, eventListener);
  }

  emit(eventName: AIClientEvent, ...eventArgs: unknown[]) {
    super.emit(eventName, ...eventArgs);
  }
}
