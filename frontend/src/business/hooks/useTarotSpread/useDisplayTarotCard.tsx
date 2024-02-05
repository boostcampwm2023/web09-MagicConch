import useOverlay from '@business/hooks/useOverlay';

import { getTarotImageQuery } from '@stores/queries/getTarotImageQuery';

export default function useDisplayTarotCard() {
  const { openOverlay } = useOverlay();

  const displayTarotCard = (tarotId: number) => {
    openOverlay(({ closeOverlay }) => {
      setTimeout(closeOverlay, 5000);

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
