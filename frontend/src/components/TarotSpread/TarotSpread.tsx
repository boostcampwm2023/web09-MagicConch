import Background from '../Background';
import TarotCard from './TarotCard';
import { shuffledArray } from '@utils/array';
import { useEffect, useMemo, useState, useRef } from 'react';

interface TarotSpreadProps {
  opened: boolean;
  close: () => void;
  pickCard: (idx: number) => void;
}

const TAROT_COUNT = 78;
const spreadSound = new Audio('../../../public/spreadCards.mp3');

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
    addEventListener('wheel', ({ deltaX }: WheelEvent) => rotateTarotSpread(deltaX > 0 ? 'left' : 'right'));
    addEventListener('animationend', ({ animationName }: AnimationEvent) => animationName == 'fadeOut' && close());
    setTimeout(() => spreadTarotCards(), 100);
  }, []);

  const dragTarotSpread = (pageX: number) => {
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
      ref.style.transform = `rotate(${idx * 4.6}deg)`;
      ref.style.transition = 'transform 1s ease-in-out';
    });
  };

  const unSpreadTarotCards = () => {
    spreadSound.play();
    tarotCardRefs.current.forEach(ref => (ref.style.transform = `rotate(0deg)`));
  };

  const clickCard = (id: number) => {
    pickCard(id);
    setPicked(id);
    setTimeout(() => {
      setClosing(true);
      unSpreadTarotCards();
    }, 1500);
  };

  return (
    <Background type={`${closing ? 'close' : 'open'}`}>
      <div
        ref={tarotSpreadRef}
        onMouseMove={({ pageX }) => dragTarotSpread(pageX)}
        onMouseDown={() => setDragging(true)}
        onMouseLeave={() => setDragging(false)}
        onMouseUp={() => setDragging(false)}
        className="transition-all ease-out absolute w-400 h-220 origin-center top-1200 left-[50%] translate-x-[-50%]"
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
