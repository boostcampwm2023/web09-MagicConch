import { SocketManager } from './SocketManager';

export class AISocketManager extends SocketManager<
  AiSocketEvent['ServerToClientEvent'],
  AiSocketEvent['ClientToServerEvent']
> {
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
}
