import { useState } from 'react';

interface TarotCardProps {
  dragging: boolean;
  index: number;
  backImg: string;
  onClick: () => void;
}

export default function TarotCard({ dragging, index, backImg, onClick }: TarotCardProps) {
  const [img, setImg] = useState<string>(backImg);

  const getFlippedCard = () => {
    // TODO: react-query api로 이미지를 가져오도록 수정해야 함 & 78개 이미지로 수정
    setImg(`../../../__tests__/mocks/cards/${(index % 22).toString().padStart(2, '0')}.jpg`);
  };

  const clickCard = () => {
    getFlippedCard();
    onClick();
  };

  return (
    <img
      className={`${!dragging && 'hover:animate-tarotHovering'} animate-tarotLeaving w-full h-full -translate-y-1000`}
      src={img}
      alt="타로 카드 이미지"
      onClick={clickCard}
    />
  );
}
