import TarotSpread from '@components/TarotSpread';

import useOverlay from '@business/hooks/useOverlay';

export function useTarotSpread(setTarotId: (idx: number) => void) {
  const { openOverlay } = useOverlay();

  const pickCard = (idx: number) => {
    setTarotId(idx);
  };

  const openTarotSpread = () => {
    openOverlay(({ opened, closeOverlay }) => (
      <TarotSpread
        opened={opened}
        closeSpread={closeOverlay}
        pickCard={pickCard}
      />
    ));
  };

  return { openTarotSpread };
}
