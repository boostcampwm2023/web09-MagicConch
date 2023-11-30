import { getTarotImageQuery } from '@stores/queries/getTarotImageQuery';

interface TarotCardProps {
  width: number;
  height: number;
  tarotId: number;
}

export default function TarotCard({ width, height, tarotId }: TarotCardProps) {
  const cardUrl = getTarotImageQuery(tarotId).data.cardUrl;

  return (
    <img
      className={`w-${width} h-${height} rounded-lg`}
      src={cardUrl}
    />
  );
}
