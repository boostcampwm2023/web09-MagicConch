import { useTarotSpread } from '../useTarotSpread';
import { useEffect } from 'react';

import { AISocketManager } from '@business/services/SocketManager';

export function useAiTarotSpread(setTarotId: (idx: number) => void) {
  const socketManager = new AISocketManager();

  const pickCard = (idx: number) => {
    socketManager.emit('tarotRead', idx);
    setTarotId(idx);
  };

  const { openTarotSpread } = useTarotSpread(pickCard);

  useEffect(() => {
    socketManager.on('tarotCard', () => setTimeout(openTarotSpread, 1000));
  }, []);
}
