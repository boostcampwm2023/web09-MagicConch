import SocketManager from './SocketManager';

type OnEventNames =
  | 'welcome'
  | 'offer'
  | 'answer'
  | 'candidate'
  | 'roomFull'
  | 'userExit'
  | 'hostExit'
  | 'roomCreated'
  | 'joinRoomFailed'
  | 'joinRoomSuccess'
  | 'createRoomFailed'
  | 'createRoomSuccess'
  | 'roomNameGenerated'
  | 'roomExist'
  | 'roomNotExist';

type EmitEventNames =
  | 'offer'
  | 'answer'
  | 'candidate'
  | 'joinRoom'
  | 'createRoom'
  | 'generateRoomName'
  | 'checkRoomExist';

class HumanSocketManager extends SocketManager {
  static instance: HumanSocketManager | null = null;

  constructor() {
    if (HumanSocketManager.instance) {
      return HumanSocketManager.instance;
    }
    super(import.meta.env.VITE_HUMAN_SOCKET_URL, '/signal');
  }

  on<U>(eventName: OnEventNames, eventListener?: (args: U) => void) {
    super.on(eventName, eventListener ?? (() => {}));
  }

  emit(eventName: EmitEventNames, ...eventArgs: unknown[]) {
    super.emit(eventName, ...eventArgs);
  }
}

export default HumanSocketManager;
