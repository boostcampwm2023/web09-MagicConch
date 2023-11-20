import Background from '../Background';
import TarotCard from './TarotCard';
import { useEffect, useMemo, useState } from 'react';

interface TarotSpreadProps {
  opened: boolean;
  close: () => void;
  pickCard: (idx: number) => void;
}

// TODO: 78개로 변경
const TAROT_CARD_COUNT = 22;

export default function TarotSpread({ opened, close, pickCard }: TarotSpreadProps) {
  // TODO: react-query api로 사용자 정의 뒤면 기본 이미지 들고오기
  const [closing, setClosing] = useState<boolean>(!opened);
  const backImg = useMemo(() => `../../../__tests__/mocks/cards/back.png`, []);

  useEffect(() => {
    addEventListener('animationend', event => {
      if (event.animationName == 'fadeOut') close();
    });
  }, []);

  return (
    <Background type={`${closing ? 'close' : 'open'}`}>
      <div className="carousel carousel-center rounded-box absolute">
        {Array.from({ length: TAROT_CARD_COUNT }, (_, idx) => (
          <div
            key={idx}
            className="carousel-item"
          >
            <TarotCard
              backImg={backImg}
              onClick={idx => {
                pickCard(idx);
                setTimeout(() => setClosing(true), 1000);
              }}
            />
          </div>
        ))}
      </div>
    </Background>
  );
}
