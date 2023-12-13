import { useEffect } from 'react';

import { AISocketManager } from '@business/services/SocketManager';

import { useTarotSpread } from './useTarotSpread';

export function useAiTarotSpread(onPickCard: (idx: number) => void) {
  const socketManager = AISocketManager.getInstance();

  const pickCard = (idx: number) => {
    socketManager.emit('tarotRead', idx);
    onPickCard(idx);
  };

  const { openTarotSpread } = useTarotSpread(pickCard);

  useEffect(() => {
    socketManager.on('tarotCard', () => setTimeout(openTarotSpread, 1000));
  }, []);
}
