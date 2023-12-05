import SocketManager from './SocketManager';

type OnEventNames = 'tarotCard' | 'chatEnd' | 'streamStart' | 'streaming' | 'streamEnd';
type EmitEventNames = 'message' | 'tarotRead' | 'tarotRead';

class AISocketManager extends SocketManager {
  constructor() {
    super(import.meta.env.VITE_WAS_URL);
  }

  on<U>(eventName: OnEventNames, eventListener: (args: U) => void) {
    super.on(eventName, eventListener);
  }

  emit(eventName: EmitEventNames, ...eventArgs: unknown[]) {
    super.emit(eventName, ...eventArgs);
  }
}

export default AISocketManager;
