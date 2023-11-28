import useOverlay from '../useOverlay';
import { useSocket } from '../useSocket';
import { useEffect } from 'react';

import TarotSpread from '@components/TarotSpread';

export function useTarotSpread(setTarotId: (idx: number) => void) {
  const { open } = useOverlay();
  const { socketEmit, socketOn } = useSocket('AIChat');

  const pickCard = (idx: number) => {
    socketEmit('tarotRead', idx);
    setTarotId(idx);
  };

  const openTarotSpread = () => {
    open(({ opened, close }) => (
      <TarotSpread
        opened={opened}
        close={close}
        pickCard={pickCard}
      />
    ));
  };

  useEffect(() => {
    socketOn('tarotCard', () => setTimeout(openTarotSpread, 1000));
  }, []);
}
