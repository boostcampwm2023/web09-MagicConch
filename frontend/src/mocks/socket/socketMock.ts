import { HumanSocketManager } from '@business/services/SocketManager';

export let mockSocketManager = {
  emit: vi.fn(),
} as any as HumanSocketManager;
