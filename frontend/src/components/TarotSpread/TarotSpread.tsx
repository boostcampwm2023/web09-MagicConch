import Background from '../Background';
import TarotCard from './TarotCard';
import { shuffledArray } from '@utils/array';
import { useEffect, useMemo, useState } from 'react';

import { rotation } from '@constants/tarotCard';

interface TarotSpreadProps {
  opened: boolean;
  close: () => void;
  pickCard: (idx: number) => void;
}

const TAROT_COUNT = 78;

export default function TarotSpread({ opened, close, pickCard }: TarotSpreadProps) {
  // TODO: react-query api로 사용자 정의 뒷면 기본 이미지 들고오기
  const [closing, setClosing] = useState<boolean>(!opened);
  const [picked, setPicked] = useState<number>();

  const backImg = useMemo(() => `../../../__tests__/mocks/cards/back.png`, []);
  const shuffledCard = useMemo(() => shuffledArray(Array.from({ length: TAROT_COUNT }, (_, idx) => idx)), []);

  useEffect(() => {
    addEventListener('animationend', event => {
      if (event.animationName == 'fadeOut') close();
    });
  }, []);

  const clickCard = (id: number) => {
    pickCard(id);
    setPicked(id);
    setTimeout(() => setClosing(true), 1500);
  };

  return (
    <Background type={`${closing ? 'close' : 'open'}`}>
      <div className="absolute w-220 h-400 origin-center top-1200 left-[50%] translate-x-[-50%]">
        {shuffledCard.map((id: number, idx: number) => (
          <div
            key={id}
            className={`${picked && 'pointer-events-none'} ${rotation[(idx + 20) % TAROT_COUNT]} 
                        absolute w-full h-full`}
          >
            <TarotCard
              index={id}
              backImg={backImg}
              onClick={() => clickCard(id)}
            />
          </div>
        ))}
      </div>
    </Background>
  );
}
