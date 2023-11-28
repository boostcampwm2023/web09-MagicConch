import TarotSpread from '@components/TarotSpread';

import useOverlay from './useOverlay';

export function useTarotSpread(setTarotId: (idx: number) => void) {
  const { open } = useOverlay();

  const pickCard = (idx: number) => {
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

  return { openTarotSpread };
}
