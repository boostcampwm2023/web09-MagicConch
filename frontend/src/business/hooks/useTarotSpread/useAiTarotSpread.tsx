import { useEffect } from 'react';

import { useSocket } from '@business/hooks/useSocket';

import { useTarotSpread } from './useTarotSpread';

export function useAiTarotSpread(onPickCard: (idx: number) => void) {
  const { socketEmit, socketOn } = useSocket('AIChat');

  const pickCard = (idx: number) => {
    socketEmit('tarotRead', idx);
    onPickCard(idx);
  };

  const { openTarotSpread } = useTarotSpread(pickCard);

  useEffect(() => {
    socketOn('tarotCard', () => setTimeout(openTarotSpread, 1000));
  }, []);
}
