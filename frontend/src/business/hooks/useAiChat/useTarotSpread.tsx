import useOverlay from '../useOverlay';
import { useEffect } from 'react';

import TarotSpread from '@components/TarotSpread';

import { aiSocketEmit, aiSocketOn } from '@business/services/socket';

export function useTarotSpread(tarotCardId: React.MutableRefObject<number | undefined>) {
  const { open } = useOverlay();

  const pickCard = (idx: number) => {
    aiSocketEmit('tarotRead', idx);
    tarotCardId.current = idx;
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
    aiSocketOn('tarotCard', () => setTimeout(openTarotSpread, 1000));
  }, []);
}
