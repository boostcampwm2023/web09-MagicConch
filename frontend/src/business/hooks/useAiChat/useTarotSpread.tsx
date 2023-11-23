import useOverlay from '../useOverlay';
import { useEffect } from 'react';

import TarotSpread from '@components/TarotSpread';

import { aiSocketEmit, aiSocketOn } from '@business/services/socket';

export function useTarotSpread(tarotCardId: React.MutableRefObject<string | undefined>) {
  const { open } = useOverlay();

  const pickCard = (idx: number) => {
    aiSocketEmit('tarotRead', idx);
    tarotCardId.current = idx.toString().padStart(2, '0'); // TODO: server에서 가져오는 데이터로 변경되면 padStart 삭제
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
