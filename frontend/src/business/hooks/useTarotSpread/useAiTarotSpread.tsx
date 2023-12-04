import { useEffect } from 'react';

import { useSocket } from '@business/hooks/useSocket';

import { useTarotSpread } from './useTarotSpread';

export function useAiTarotSpread(setTarotId: (idx: number) => void) {
  const { socketEmit, socketOn } = useSocket('AIChat');

  const pickCard = (idx: number) => {
    socketEmit('tarotRead', idx);
    setTarotId(idx);
  };

  const { openTarotSpread } = useTarotSpread(pickCard);

  useEffect(() => {
    socketOn('tarotCard', () => setTimeout(openTarotSpread, 1000));
  }, []);
}
