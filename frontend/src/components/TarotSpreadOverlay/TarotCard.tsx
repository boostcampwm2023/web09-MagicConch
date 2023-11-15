import { useEffect, useState } from 'react';

interface TarotCardProps {
  idx?: number; // undefined면 뒷면을 의미함
  onClick?: () => void;
}

export default function TarotCard({ idx, onClick }: TarotCardProps) {
  const [img, setImg] = useState<string>('');

  useEffect(() => {
    // ToDo: react-query api로 이미지를 가져오도록 수정해야 함
    async function fetchCardImg() {
      const cardName = idx === undefined ? 'back' : idx.toString().padStart(2, '0');
      const res = await import(`../../mocks/cards/${cardName}.jpg`);
      setImg(res.default);
    }
    fetchCardImg();
  }, []);

  return (
    <img
      className="w-288 h-480 absolute"
      src={img}
      alt="타로 카드 이미지"
      onClick={onClick}
    />
  );
}
