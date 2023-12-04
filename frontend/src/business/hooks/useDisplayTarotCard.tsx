import { getTarotImageQuery } from '@stores/queries/getTarotImageQuery';

import useOverlay from './useOverlay';

export default function useDisplayTarotCard() {
  const { open } = useOverlay();

  const displayTarotCard = (tarotId: number) => {
    open(({ close }) => {
      setTimeout(close, 5000);

      return (
        <div className="animate-shining">
          <TarotCard tarotId={tarotId} />
        </div>
      );
    });
  };

  return { displayTarotCard };
}

function TarotCard({ tarotId }: { tarotId: number }) {
  const cardUrl = getTarotImageQuery(tarotId).data.cardUrl;

  return (
    <img
      className="w-240 h-400 rounded-lg"
      src={cardUrl}
    />
  );
}
