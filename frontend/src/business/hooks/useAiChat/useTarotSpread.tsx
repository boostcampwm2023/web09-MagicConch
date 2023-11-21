import useOverlay from '../useOverlay';
import { useEffect } from 'react';

import TarotSpread from '@components/TarotSpread';

import { requestTarotRead, setTarotCardEventListener } from '@business/services/socket';

import { tarotCardNames } from '@constants/tarotCardNames';

export function useTarotSpread(tarotCardId: React.MutableRefObject<string | undefined>) {
  const { open } = useOverlay();

  const pickCard = (idx: number) => {
    idx %= tarotCardNames.length;
    requestTarotRead(`${idx}번 ${tarotCardNames[idx]}카드`);
    tarotCardId.current = idx.toString().padStart(2, '0');
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
    setTarotCardEventListener(() => setTimeout(openTarotSpread, 3000));
  }, []);
}
