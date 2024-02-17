import { SocketManager } from '.';
import { HumanClientEvent, HumanServerEvent } from '@tarotmilktea/human-socketio-event';

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

  on<U>(eventName: HumanServerEvent, eventListener: (args: U) => void) {
    super.on(eventName, eventListener);
  }

  emit(eventName: HumanClientEvent, ...eventArgs: unknown[]) {
    super.emit(eventName, ...eventArgs);
  }
}
