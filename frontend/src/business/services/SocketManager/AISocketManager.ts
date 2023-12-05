import { AIClientEvent, AIServerEvent } from '@tarotmilktea/ai-socketio-event';

import SocketManager from './SocketManager';

class AISocketManager extends SocketManager {
  constructor() {
    super(import.meta.env.VITE_WAS_URL);
  }

  on<U>(eventName: AIServerEvent, eventListener: (args: U) => void) {
    super.on(eventName, eventListener);
  }

  emit(eventName: AIClientEvent, ...eventArgs: unknown[]) {
    super.emit(eventName, ...eventArgs);
  }
}

export default AISocketManager;
