import { useEffect } from 'react';

import { HumanSocketManager } from '@business/services/SocketManager';

export function useHumanSocket({ disconnect = false }) {
  const humanSocket = HumanSocketManager.getInstance();
  useEffect(() => {
    humanSocket.connect();
    if (!disconnect) {
      humanSocket.connect();
    }
  }, []);
}
