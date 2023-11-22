import Background from '../Background';
import { useEffect, useMemo, useRef, useState } from 'react';

import { shuffledArray } from '@utils/array';

import TarotCard from './TarotCard';

interface TarotSpreadProps {
  opened: boolean;
  close: () => void;
  pickCard: (idx: number) => void;
}

const TAROT_COUNT = 78;
const spreadSound = new Audio('/spreadCards.mp3');

export default function TarotSpread({ opened, close, pickCard }: TarotSpreadProps) {
  const [closing, setClosing] = useState<boolean>(!opened);
  const [picked, setPicked] = useState<number>();
  const [dragging, setDragging] = useState<boolean>(false);

  const tarotCardRefs = useRef<HTMLDivElement[]>([]);
  const prevMouseXRef = useRef<number>(0);
  const tarotSpreadRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<number>(0);

  // TODO: react-query api로 사용자 정의 뒷면 기본 이미지 들고오기
  const backImg = useMemo(() => `../../../__tests__/mocks/cards/back.png`, []);
  const shuffledCard = useMemo(() => shuffledArray(Array.from({ length: TAROT_COUNT }, (_, idx) => idx)), []);

  useEffect(() => {
    const rotateSpread = ({ deltaX }: WheelEvent) => rotateTarotSpread(deltaX > 0 ? 'left' : 'right');
    const closeWithFadeOut = ({ animationName }: AnimationEvent) => animationName == 'fadeOut' && close();

    addEventListener('wheel', rotateSpread);
    addEventListener('animationend', closeWithFadeOut);
    setTimeout(spreadTarotCards, 100);

    return () => {
      removeEventListener('wheel', rotateSpread);
      removeEventListener('animationend', closeWithFadeOut);
    };
  }, []);

  const dragTarotSpread = ({ pageX }: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) rotateTarotSpread(prevMouseXRef.current < pageX ? 'right' : 'left');
    prevMouseXRef.current = pageX;
  };

  const rotateTarotSpread = (direction: 'right' | 'left') => {
    const target = tarotSpreadRef.current;
    if (!target) return;

    const rotateIndex = rotationRef.current;
    const nextRotateIndex = direction == 'right' ? rotateIndex + 1 : rotateIndex - 1;
    target.style.transform = `translateX(-50%) rotate(${nextRotateIndex * 0.6}deg)`;
    rotationRef.current = nextRotateIndex;
  };

  const spreadTarotCards = () => {
    spreadSound.play();
    tarotCardRefs.current.forEach((ref, idx) => {
      ref.style.transform = `rotate(${270 + idx * 4.6}deg)`;
      ref.style.transition = 'transform 1s ease-out';
    });
  };

  const unSpreadTarotCards = () => {
    spreadSound.play();
    setTimeout(() => tarotCardRefs.current.forEach(ref => (ref.style.transform = `rotate(270deg)`)), 500);
  };

  const clickCard = (id: number) => {
    pickCard(id);
    setPicked(id);
    setTimeout(() => unSpreadTarotCards(), 1500);
    setTimeout(() => setClosing(true), 2000);
  };

  return (
    <Background type={`${closing ? 'close' : 'open'}`}>
      <div
        ref={tarotSpreadRef}
        onMouseMove={dragTarotSpread}
        onMouseDown={() => setDragging(true)}
        onMouseLeave={() => setDragging(false)}
        onMouseUp={() => setDragging(false)}
        className="transition-all ease-out absolute w-220 h-400 origin-center top-1200 left-[50%] translate-x-[-50%]"
      >
        {shuffledCard.map((id: number, idx: number) => (
          <div
            key={id}
            ref={ref => (tarotCardRefs.current[idx] = ref!)}
            className={`${picked && 'pointer-events-none'} absolute w-full h-full`}
          >
            <TarotCard
              dragging={dragging}
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
