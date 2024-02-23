import { SocketManager } from './SocketManager';

// export class HumanSocketManager extends SocketManager<
//   HumanSocketEvent['ServerToClientEvent'],
//   HumanSocketEvent['ClientToServerEvent']
// > {

export class HumanSocketManager extends SocketManager<any, any> {
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
}
