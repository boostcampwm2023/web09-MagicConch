import { useEffect } from 'react';

import { AISocketManager, HumanSocketManager } from '@business/services/SocketManager';

export function useReset() {
  const aiSocketManager = AISocketManager.getInstance();
  const humanSocketManager = HumanSocketManager.getInstance();

  useEffect(() => {
    aiSocketManager.disconnect();
    humanSocketManager.disconnect();
  }, []);
}
