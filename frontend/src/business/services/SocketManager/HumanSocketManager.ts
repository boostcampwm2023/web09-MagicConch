import { HumanClientEvent, HumanServerEvent } from '@tarotmilktea/human-socketio-event';

import SocketManager from './SocketManager';

class HumanSocketManager extends SocketManager {
  static instance: HumanSocketManager | null = null;

  constructor() {
    if (HumanSocketManager.instance) {
      return HumanSocketManager.instance;
    }
    super(import.meta.env.VITE_HUMAN_SOCKET_URL, '/signal');
  }

  on<U>(eventName: HumanServerEvent, eventListener: (args: U) => void) {
    super.on(eventName, eventListener);
  }

  emit(eventName: HumanClientEvent, ...eventArgs: unknown[]) {
    super.emit(eventName, ...eventArgs);
  }
}

export default HumanSocketManager;
