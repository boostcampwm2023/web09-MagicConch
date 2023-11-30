import TarotCard from '@components/TarotCard';

import useOverlay from './useOverlay';

export default function useDisplayTarotCard() {
  const { open } = useOverlay();

  const displayTarotCard = (tarotId: number) => {
    open(({ close }) => {
      setTimeout(close, 5000);

      return (
        <div className="animate-shining">
          <TarotCard
            width={240}
            height={400}
            tarotId={tarotId}
          />
        </div>
      );
    });
  };

  return { displayTarotCard };
}
