import { useState } from 'react';

interface TarotCardProps {
  backImg: string;
  onClick: (idx: number) => void;
}

export default function TarotCard({ backImg, onClick }: TarotCardProps) {
  const [img, setImg] = useState<string>(backImg);

  const flipCard = () => {
    // TODO: react-query api로 이미지를 가져오도록 수정해야 함
    const picked = Math.floor(Math.random() * 22);
    setImg(`../../../__tests__/mocks/cards/${picked.toString().padStart(2, '0')}.jpg`);
    return picked;
  };

  return (
    <img
      className={`w-144 h-240`}
      src={img}
      alt="타로 카드 이미지"
      onClick={() => onClick(flipCard())}
    />
  );
}
